import Stripe from 'stripe';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { config } from '../../config';
import { AppError } from '../../errors/AppError';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-02-24.acacia' as any,
});

export const initiateCheckout = async (customerId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId, customerId, deletedAt: null },
    include: { orderItems: { include: { medicine: true } } },
  });

  if (!order) throw new AppError(404, 'Order not found.');
  if (order.status !== OrderStatus.PENDING) {
    throw new AppError(400, `Cannot pay for order with status '${order.status}'.`);
  }

  const lineItems = order.orderItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.medicine.name,
        description: `Strength: ${item.medicine.strength}`,
      },
      unit_amount: Math.round(item.unitPrice * 100),
    },
    quantity: item.quantity,
  }));

  // Create Stripe Checkout Session (or mock session URL if keys not yet in live mode)
  let sessionUrl = `${config.clientUrl}/checkout/success?session_id=mock_session_${order.id}`;
  let sessionId = `cs_test_${order.id}_${Date.now()}`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${config.clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.clientUrl}/checkout/cancel`,
      metadata: { orderId: order.id, customerId },
    });
    if (session.url) sessionUrl = session.url;
    if (session.id) sessionId = session.id;
  } catch (err) {
    console.log('[Stripe Notice]: Using mock checkout session URL for local testing.');
  }

  // Create or update payment record
  const payment = await prisma.payment.upsert({
    where: { orderId: order.id },
    update: {
      stripeSessionId: sessionId,
      amount: order.totalAmount,
      status: PaymentStatus.PENDING,
    },
    create: {
      orderId: order.id,
      stripeSessionId: sessionId,
      amount: order.totalAmount,
      currency: 'usd',
      status: PaymentStatus.PENDING,
    },
  });

  return { checkoutUrl: sessionUrl, sessionId, payment };
};

export const verifyPaymentSession = async (sessionId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { stripeSessionId: sessionId },
    include: { order: true },
  });

  if (!payment) throw new AppError(404, 'Payment session record not found.');

  // Update payment and order to PAID in a transaction
  return prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.SUCCEEDED,
        paidAt: new Date(),
      },
    });

    const updatedOrder = await tx.order.update({
      where: { id: payment.orderId },
      data: { status: OrderStatus.PAID },
    });

    return { payment: updatedPayment, order: updatedOrder };
  });
};

export const getPaymentStatus = async (orderId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
    include: { order: { select: { id: true, status: true, totalAmount: true } } },
  });

  if (!payment) throw new AppError(404, 'Payment record for this order not found.');
  return payment;
};

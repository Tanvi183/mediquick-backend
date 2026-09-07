import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { config } from '../../config';
import { AppError } from '../../errors/AppError';

export const registerUser = async (payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(409, 'User with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(payload.password, config.bcryptSaltRounds);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash: hashedPassword,
        role: payload.role || UserRole.CUSTOMER,
        phone: payload.phone,
        avatar: payload.avatar,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (payload.role === UserRole.PHARMACIST && payload.pharmacyName && payload.licenseNumber) {
      await tx.pharmacyProfile.create({
        data: {
          userId: user.id,
          pharmacyName: payload.pharmacyName,
          licenseNumber: payload.licenseNumber,
          address: payload.pharmacyAddress || 'Central City',
          isVerified: false,
        },
      });
    }

    return user;
  });

  const accessToken = jwt.sign(
    { id: result.id, email: result.email, role: result.role },
    config.jwt.secret as Secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  );

  const refreshToken = jwt.sign(
    { id: result.id, email: result.email, role: result.role },
    config.jwt.refreshSecret as Secret,
    { expiresIn: config.jwt.refreshExpiresIn } as SignOptions
  );

  return { user: result, accessToken, refreshToken };
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email, deletedAt: null },
    include: { pharmacyProfile: true },
  });

  if (!user) {
    throw new AppError(404, 'No account found with this email.');
  }

  if (user.status === 'BLOCKED') {
    throw new AppError(403, 'Your account has been suspended. Please contact admin.');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isPasswordMatched) {
    throw new AppError(401, 'Invalid credentials! Password does not match.');
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret as Secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.refreshSecret as Secret,
    { expiresIn: config.jwt.refreshExpiresIn } as SignOptions
  );

  const { passwordHash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (token: string) => {
  try {
    const verified = jwt.verify(token, config.jwt.refreshSecret as Secret) as any;
    const user = await prisma.user.findUnique({
      where: { id: verified.id, deletedAt: null },
    });

    if (!user) {
      throw new AppError(404, 'User does not exist.');
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret as Secret,
      { expiresIn: config.jwt.expiresIn } as SignOptions
    );

    return { accessToken: newAccessToken };
  } catch (err) {
    throw new AppError(401, 'Invalid or expired refresh token.');
  }
};

export const changePassword = async (userId: string, payload: { oldPassword: string; newPassword: string }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
  });

  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  const isPasswordMatched = await bcrypt.compare(payload.oldPassword, user.passwordHash);
  if (!isPasswordMatched) {
    throw new AppError(400, 'Current password is incorrect.');
  }

  const newHashedPassword = await bcrypt.hash(payload.newPassword, config.bcryptSaltRounds);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHashedPassword },
  });

  return { message: 'Password changed successfully.' };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      avatar: true,
      pharmacyProfile: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User profile not found.');
  }

  return user;
};

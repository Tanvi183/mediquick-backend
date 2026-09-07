import { PrismaClient, UserRole, UserStatus, DosageForm } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const passwordHash = await bcrypt.hash('AdminPassword123!', 10);
  const pharmacistHash = await bcrypt.hash('PharmacistPassword123!', 10);
  const customerHash = await bcrypt.hash('CustomerPassword123!', 10);

  // 1. Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mediquick.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@mediquick.com',
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      phone: '+1-800-555-0199',
    },
  });

  const pharmacist = await prisma.user.upsert({
    where: { email: 'pharmacist@mediquick.com' },
    update: {},
    create: {
      name: 'Dr. Sarah Jenkins, PharmD',
      email: 'pharmacist@mediquick.com',
      passwordHash: pharmacistHash,
      role: UserRole.PHARMACIST,
      status: UserStatus.ACTIVE,
      phone: '+1-800-555-0144',
      pharmacyProfile: {
        create: {
          pharmacyName: 'CarePlus Central Pharmacy',
          licenseNumber: 'RX-PHARM-889921',
          address: '742 Evergreen Terrace, Medical District',
          isVerified: true,
        },
      },
    },
    include: { pharmacyProfile: true },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@mediquick.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer@mediquick.com',
      passwordHash: customerHash,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      phone: '+1-800-555-0177',
    },
  });

  console.log('✅ Seeded users:', { admin: admin.email, pharmacist: pharmacist.email, customer: customer.email });

  // 2. Seed Categories
  const categories = [
    { name: 'Antibiotics', slug: 'antibiotics', description: 'Medicines that fight bacterial infections' },
    { name: 'Pain Relief & Analgesics', slug: 'pain-relief', description: 'Pain relievers and fever reducers' },
    { name: 'Cardiovascular & Blood Pressure', slug: 'cardiovascular', description: 'Hypertension and heart medications' },
    { name: 'Vitamins & Dietary Supplements', slug: 'vitamins-supplements', description: 'Essential vitamins, minerals and wellness' },
    { name: 'First Aid & Antiseptics', slug: 'first-aid', description: 'Bandages, antiseptic lotions and emergency supplies' },
  ];

  const categoryMap = new Map();
  for (const cat of categories) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, createdCat.id);
  }
  console.log('✅ Seeded categories.');

  // 3. Seed Medicines
  const pharmacyId = pharmacist.pharmacyProfile!.id;
  const medicines = [
    {
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin Trihydrate',
      categoryId: categoryMap.get('antibiotics')!,
      pharmacyId,
      dosageForm: DosageForm.CAPSULE,
      strength: '500mg',
      price: 18.5,
      stockQuantity: 120,
      requiresPrescription: true,
      manufacturer: 'Pfizer Inc.',
      expiryDate: new Date('2028-12-31'),
    },
    {
      name: 'Paracetamol Extra 500mg',
      genericName: 'Acetaminophen / Caffeine',
      categoryId: categoryMap.get('pain-relief')!,
      pharmacyId,
      dosageForm: DosageForm.TABLET,
      strength: '500mg/65mg',
      price: 6.99,
      stockQuantity: 350,
      requiresPrescription: false,
      manufacturer: 'GSK Healthcare',
      expiryDate: new Date('2029-06-30'),
    },
    {
      name: 'Amlodipine Besylate 5mg',
      genericName: 'Amlodipine',
      categoryId: categoryMap.get('cardiovascular')!,
      pharmacyId,
      dosageForm: DosageForm.TABLET,
      strength: '5mg',
      price: 24.0,
      stockQuantity: 80,
      requiresPrescription: true,
      manufacturer: 'Novartis Pharma',
      expiryDate: new Date('2028-08-15'),
    },
    {
      name: 'Vitamin C + Zinc Immune Boost',
      genericName: 'Ascorbic Acid & Zinc',
      categoryId: categoryMap.get('vitamins-supplements')!,
      pharmacyId,
      dosageForm: DosageForm.TABLET,
      strength: '1000mg',
      price: 14.99,
      stockQuantity: 200,
      requiresPrescription: false,
      manufacturer: 'Nature Made',
      expiryDate: new Date('2029-01-01'),
    },
  ];

  for (const med of medicines) {
    await prisma.medicine.create({ data: med });
  }

  console.log('✅ Seeded sample medicines in catalog.');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

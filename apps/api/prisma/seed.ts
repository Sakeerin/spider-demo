import { PrismaClient, UserRole, ServiceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@spider.com',
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  // Create coordinator user
  const coordinatorUser = await prisma.user.create({
    data: {
      email: 'coordinator@spider.com',
      role: UserRole.COORDINATOR,
      firstName: 'Coordinator',
      lastName: 'User',
    },
  });

  // Create sales user
  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@spider.com',
      role: UserRole.SALES,
      firstName: 'Sales',
      lastName: 'User',
    },
  });

  // Create sample customer
  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      role: UserRole.CUSTOMER,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+66123456789',
    },
  });

  // Create sample contractor user
  const contractorUser = await prisma.user.create({
    data: {
      email: 'contractor@example.com',
      role: UserRole.CONTRACTOR,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+66987654321',
    },
  });

  // Create contractor profile
  const contractor = await prisma.contractor.create({
    data: {
      userId: contractorUser.id,
      businessName: 'Smith Construction Co.',
      services: [ServiceType.CONSTRUCTION, ServiceType.RENOVATION],
      experience: 5,
      isApproved: true,
    },
  });

  console.log('Database seeded successfully!');
  console.log({
    adminUser,
    coordinatorUser,
    salesUser,
    customer,
    contractorUser,
    contractor,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

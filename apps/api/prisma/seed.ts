import { 
  PrismaClient, 
  UserRole, 
  ServiceType, 
  Province, 
  VerificationStatus,
  UrgencyLevel,
  LeadStatus,
  ProductCategory
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user with profile
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@spider.com',
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
      profile: {
        create: {
          province: Province.BANGKOK,
          city: 'Bangkok',
          timezone: 'Asia/Bangkok',
        },
      },
    },
  });

  // Create coordinator user
  const coordinatorUser = await prisma.user.create({
    data: {
      email: 'coordinator@spider.com',
      role: UserRole.COORDINATOR,
      firstName: 'Coordinator',
      lastName: 'User',
      profile: {
        create: {
          province: Province.BANGKOK,
          city: 'Bangkok',
        },
      },
    },
  });

  // Create sales user
  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@spider.com',
      role: UserRole.SALES,
      firstName: 'Sales',
      lastName: 'User',
      profile: {
        create: {
          province: Province.BANGKOK,
          city: 'Bangkok',
        },
      },
    },
  });

  // Create sample customers
  const customer1 = await prisma.user.create({
    data: {
      email: 'customer1@example.com',
      role: UserRole.CUSTOMER,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+66123456789',
      profile: {
        create: {
          province: Province.BANGKOK,
          city: 'Bangkok',
          address: '123 Sukhumvit Road',
          postalCode: '10110',
        },
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'customer2@example.com',
      role: UserRole.CUSTOMER,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+66987654321',
      profile: {
        create: {
          province: Province.CHONBURI,
          city: 'Pattaya',
          address: '456 Beach Road',
          postalCode: '20150',
        },
      },
    },
  });

  // Create sample contractor users and profiles
  const contractorUser1 = await prisma.user.create({
    data: {
      email: 'contractor1@example.com',
      role: UserRole.CONTRACTOR,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+66111222333',
      profile: {
        create: {
          province: Province.BANGKOK,
          city: 'Bangkok',
        },
      },
    },
  });

  const contractor1 = await prisma.contractor.create({
    data: {
      userId: contractorUser1.id,
      businessName: 'Smith Construction Co.',
      services: [ServiceType.CONSTRUCTION, ServiceType.RENOVATION],
      serviceAreas: [Province.BANGKOK, Province.NONTHABURI],
      experience: 5,
      verification: VerificationStatus.VERIFIED,
      isApproved: true,
      description: 'Professional construction and renovation services with 5+ years experience',
      averageRating: 4.5,
      totalReviews: 23,
      successRate: 95.5,
      responseTime: 30,
    },
  });

  const contractorUser2 = await prisma.user.create({
    data: {
      email: 'contractor2@example.com',
      role: UserRole.CONTRACTOR,
      firstName: 'Mike',
      lastName: 'Wilson',
      phone: '+66444555666',
      profile: {
        create: {
          province: Province.CHONBURI,
          city: 'Pattaya',
        },
      },
    },
  });

  const contractor2 = await prisma.contractor.create({
    data: {
      userId: contractorUser2.id,
      businessName: 'Wilson Smart Home Solutions',
      services: [ServiceType.SMART_HOME, ServiceType.SOLAR_INSTALLATION],
      serviceAreas: [Province.CHONBURI, Province.RAYONG],
      experience: 3,
      verification: VerificationStatus.VERIFIED,
      isApproved: true,
      description: 'Specialized in smart home installations and solar energy solutions',
      averageRating: 4.8,
      totalReviews: 15,
      successRate: 98.0,
      responseTime: 15,
    },
  });

  // Create portfolio items
  await prisma.portfolioItem.create({
    data: {
      contractorId: contractor1.id,
      title: 'Modern Kitchen Renovation',
      description: 'Complete kitchen renovation with modern appliances and design',
      images: ['/portfolio/kitchen1.jpg', '/portfolio/kitchen2.jpg'],
      serviceType: ServiceType.RENOVATION,
      completedAt: new Date('2023-10-15'),
    },
  });

  await prisma.portfolioItem.create({
    data: {
      contractorId: contractor2.id,
      title: 'Smart Home Automation System',
      description: 'Full home automation with lighting, security, and climate control',
      images: ['/portfolio/smart1.jpg', '/portfolio/smart2.jpg'],
      serviceType: ServiceType.SMART_HOME,
      completedAt: new Date('2023-11-20'),
    },
  });

  // Create sample leads
  const lead1 = await prisma.lead.create({
    data: {
      customerId: customer1.id,
      serviceType: ServiceType.RENOVATION,
      description: 'Need to renovate bathroom and kitchen in my condo',
      urgency: UrgencyLevel.MEDIUM,
      address: '123 Sukhumvit Road',
      city: 'Bangkok',
      province: Province.BANGKOK,
      postalCode: '10110',
      budgetMin: 100000,
      budgetMax: 200000,
      source: 'website',
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      customerId: customer2.id,
      serviceType: ServiceType.SOLAR_INSTALLATION,
      description: 'Looking to install solar panels for my house',
      urgency: UrgencyLevel.LOW,
      address: '456 Beach Road',
      city: 'Pattaya',
      province: Province.CHONBURI,
      postalCode: '20150',
      budgetMin: 300000,
      budgetMax: 500000,
      source: 'referral',
    },
  });

  // Create sample products
  await prisma.product.create({
    data: {
      category: ProductCategory.SOLAR,
      name: 'Premium Solar Panel System 5kW',
      description: 'High-efficiency solar panel system perfect for residential use',
      specifications: {
        power: '5kW',
        panels: 16,
        warranty: '25 years',
        efficiency: '22%',
      },
      images: ['/products/solar1.jpg', '/products/solar2.jpg'],
      priceMin: 250000,
      priceMax: 350000,
      slug: 'premium-solar-panel-5kw',
      metaTitle: 'Premium 5kW Solar Panel System - SPIDER',
      metaDescription: 'High-efficiency 5kW solar panel system with 25-year warranty',
      isFeatured: true,
    },
  });

  await prisma.product.create({
    data: {
      category: ProductCategory.EV_CHARGER,
      name: 'Smart EV Charger 22kW',
      description: 'Fast charging solution for electric vehicles with smart features',
      specifications: {
        power: '22kW',
        connector: 'Type 2',
        features: ['WiFi', 'App Control', 'Load Balancing'],
        installation: 'Wall Mount',
      },
      images: ['/products/ev1.jpg', '/products/ev2.jpg'],
      priceMin: 45000,
      priceMax: 65000,
      slug: 'smart-ev-charger-22kw',
      metaTitle: 'Smart 22kW EV Charger - SPIDER',
      metaDescription: 'Fast and smart EV charging solution with app control',
      isFeatured: true,
    },
  });

  // Create sample promotion
  await prisma.promotion.create({
    data: {
      title: 'New Year Solar Special',
      description: 'Get 20% off on all solar installations this January',
      serviceTypes: [ServiceType.SOLAR_INSTALLATION],
      discountType: 'PERCENTAGE',
      discountValue: 20,
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-01-31'),
      isFeatured: true,
      priority: 1,
    },
  });

  console.log('Database seeded successfully!');
  console.log({
    users: {
      admin: adminUser.id,
      coordinator: coordinatorUser.id,
      sales: salesUser.id,
      customer1: customer1.id,
      customer2: customer2.id,
      contractor1: contractorUser1.id,
      contractor2: contractorUser2.id,
    },
    contractors: {
      contractor1: contractor1.id,
      contractor2: contractor2.id,
    },
    leads: {
      lead1: lead1.id,
      lead2: lead2.id,
    },
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

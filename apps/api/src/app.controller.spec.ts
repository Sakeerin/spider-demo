import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockPrismaService = {
      healthCheck: jest.fn().mockResolvedValue({
        status: 'healthy',
        timestamp: new Date(),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return welcome message', () => {
      expect(appController.getHello()).toBe(
        'SPIDER Marketplace API is running!'
      );
    });
  });

  describe('health', () => {
    it('should return health status', async () => {
      const health = await appController.getHealth();
      expect(health.status).toBe('healthy');
      expect(health.version).toBe('1.0.0');
      expect(health.timestamp).toBeDefined();
      expect(health.database).toBeDefined();
    });
  });
});

import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'SPIDER Marketplace API is running!';
  }

  async getHealth() {
    try {
      const dbHealth = await this.prisma.healthCheck();
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: dbHealth,
        version: '1.0.0',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: { status: 'unhealthy', error: error.message },
        version: '1.0.0',
      };
    }
  }
}

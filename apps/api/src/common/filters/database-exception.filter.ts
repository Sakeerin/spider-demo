import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { DatabaseException } from '../exceptions/database.exception';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Convert Prisma error to our custom DatabaseException
    const dbException = new DatabaseException(exception);
    const status = dbException.getStatus();
    const message = dbException.message;

    // Log the error
    this.logger.error(
      `Database error on ${request.method} ${request.url}`,
      {
        error: exception.message,
        code: exception.code,
        meta: exception.meta,
        stack: exception.stack,
      },
    );

    // Send error response
    response.status(status).json({
      success: false,
      error: {
        code: exception.code || 'DATABASE_ERROR',
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    });
  }
}
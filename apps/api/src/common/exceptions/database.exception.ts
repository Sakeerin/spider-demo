import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class DatabaseException extends HttpException {
  constructor(error: any, context?: string) {
    const { message, status } = DatabaseException.parseError(error, context);
    super(message, status);
  }

  private static parseError(error: any, context?: string): { message: string; status: HttpStatus } {
    const contextPrefix = context ? `[${context}] ` : '';

    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return {
            message: `${contextPrefix}A record with this information already exists`,
            status: HttpStatus.CONFLICT,
          };
        case 'P2025':
          return {
            message: `${contextPrefix}Record not found`,
            status: HttpStatus.NOT_FOUND,
          };
        case 'P2003':
          return {
            message: `${contextPrefix}Foreign key constraint failed`,
            status: HttpStatus.BAD_REQUEST,
          };
        case 'P2014':
          return {
            message: `${contextPrefix}Invalid ID provided`,
            status: HttpStatus.BAD_REQUEST,
          };
        case 'P2021':
          return {
            message: `${contextPrefix}Table does not exist`,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
          };
        case 'P2022':
          return {
            message: `${contextPrefix}Column does not exist`,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
          };
        default:
          return {
            message: `${contextPrefix}Database operation failed: ${error.message}`,
            status: HttpStatus.BAD_REQUEST,
          };
      }
    }

    // Handle Prisma validation errors
    if (error instanceof Prisma.PrismaClientValidationError) {
      return {
        message: `${contextPrefix}Invalid data provided`,
        status: HttpStatus.BAD_REQUEST,
      };
    }

    // Handle Prisma initialization errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return {
        message: `${contextPrefix}Database connection failed`,
        status: HttpStatus.SERVICE_UNAVAILABLE,
      };
    }

    // Handle Prisma request errors
    if (error instanceof Prisma.PrismaClientRustPanicError) {
      return {
        message: `${contextPrefix}Database engine error`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    // Handle generic database errors
    if (error.code) {
      switch (error.code) {
        case 'ECONNREFUSED':
          return {
            message: `${contextPrefix}Database connection refused`,
            status: HttpStatus.SERVICE_UNAVAILABLE,
          };
        case 'ETIMEDOUT':
          return {
            message: `${contextPrefix}Database connection timeout`,
            status: HttpStatus.REQUEST_TIMEOUT,
          };
        default:
          return {
            message: `${contextPrefix}Database error: ${error.message}`,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
          };
      }
    }

    // Default error handling
    return {
      message: `${contextPrefix}An unexpected database error occurred`,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}
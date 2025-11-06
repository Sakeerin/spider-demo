import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Prisma } from '@prisma/client';
import { DatabaseException } from '../exceptions/database.exception';

@Injectable()
export class DatabaseErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(DatabaseErrorInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Only handle database-related errors
        if (
          error instanceof Prisma.PrismaClientKnownRequestError ||
          error instanceof Prisma.PrismaClientValidationError ||
          error instanceof Prisma.PrismaClientInitializationError ||
          error instanceof Prisma.PrismaClientRustPanicError
        ) {
          const request = context.switchToHttp().getRequest();
          const contextInfo = `${request.method} ${request.url}`;
          
          this.logger.error(
            `Database error intercepted: ${error.message}`,
            error.stack,
          );

          // Convert to our custom exception
          return throwError(() => new DatabaseException(error, contextInfo));
        }

        // Re-throw non-database errors
        return throwError(() => error);
      }),
    );
  }
}
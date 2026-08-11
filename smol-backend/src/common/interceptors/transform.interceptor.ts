import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((resData) => {
        let message = 'Success';
        let data = resData;

        if (resData && typeof resData === 'object' && !Array.isArray(resData)) {
          if ('message' in resData && typeof resData.message === 'string') {
            message = resData.message;
          }
          if ('data' in resData) {
            data = resData.data;
          } else if ('message' in resData && Object.keys(resData).length > 1) {
            const { message: _m, ...rest } = resData;
            data = rest;
          }
        }

        return {
          success: true,
          statusCode,
          message,
          data: data !== undefined ? data : null,
        };
      }),
    );
  }
}

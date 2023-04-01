import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import { AppModule } from '../app.module';
import { HttpExceptionFilter } from './exceptionFilter';
import { useContainer } from 'class-validator';

export const createApp = (app: INestApplication): INestApplication => {
  app.setGlobalPrefix('api');
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: false,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints);
          constraintsKeys.forEach((ckey) => {
            errorsForResponse.push({
              message: e.constraints[ckey],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  return app;
};

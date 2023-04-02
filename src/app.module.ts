import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { RegistrationUseCase } from './modules/auth/use-cases/registration-use.case';
import { AuthRepository } from './modules/auth/repository/atuh.repository';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from './modules/users/repository/users.repository';
import { AuthController } from './modules/auth/auth.controller';
import { EmailService } from './modules/email/email.service';
import { EmailRepository } from './modules/email/email.repository';
import { UsersController } from './modules/users/users.controller';
import { MailerModule } from '@nestjs-modules/mailer';

const useCases = [RegistrationUseCase];
const services = [AppService, PrismaService, EmailService];
const repositories = [AuthRepository, UsersRepository, EmailRepository];
const controllers = [AppController, AuthController, UsersController];
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV ?? ''}.env`,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'user2023newTestPerson@gmail.com',
          pass: 'chucmvqgtpkxstks',
        },
      },
    }),
    AuthModule,
  ],
  controllers,
  providers: [...useCases, ...services, ...repositories],
})
export class AppModule {}

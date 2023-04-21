import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './modules/auth/auth.controller';
import { EmailService } from './modules/email/email.service';
import { EmailRepository } from './modules/email/email.repository';
import { UsersController } from './modules/users/users.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthService } from './modules/auth/service/auth.service';
import { GoogleStrategy } from './modules/auth/google/strategy/google.strategy';
import { ConfirmationUseCase } from './modules/auth/use-cases/confirmation.use-case';
import { TestingController } from './modules/testing/testing.controller';
import { EmailResendingUseCase } from './modules/auth/use-cases/emailResending.use-case';
import { LoginUseCase } from './modules/auth/use-cases/login.use-case';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './modules/auth/strategies/local.strategy';
import { JWT } from './modules/auth/constants';
import { UsersService } from './modules/users/service/users.service';
import { LogoutUseCase } from './modules/auth/use-cases/logout.use-case';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DevicesRepository } from './modules/devices/repository/devices.repository';
import { DeleteAllDevicesByDeviceIdUseCase } from './modules/devices/use-cases/deleteAllDevicesByDeviceIdUseCase';
import { DeleteAlldevicesUseCase } from './modules/devices/use-cases/deleteAlldevicesUseCase';
import { GetAlldevicesUseCase } from './modules/devices/use-cases/getAllDevices.use-case';
import { DevicesController } from './modules/devices/devices.controller';
import { RefreshTokenUseCase } from './modules/auth/use-cases/refreshToken.use-case';
import { PasswordRecoveryUseCase } from './modules/auth/use-cases/passwordRecovery.use-case';
import { NewPasswordUseCase } from './modules/auth/use-cases/newPassword.use-case';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { LocalAuthGuard } from './modules/auth/guards/local-auth.guard';
import { AppService } from './app.service';
import { RegistrationUseCase } from './modules/auth/use-cases/registration-use.case';
import { AuthRepository } from './modules/auth/repository/auth.repository';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from './modules/users/repository/users.repository';
import { GoogleAuthUseCase } from './modules/auth/use-cases/google-auth.use-case';
import { UploadFileUseCase } from './modules/users/use-cases/upload-file.use-case';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { UpdateProfileUseCase } from './modules/users/use-cases/update-profile.use-case';
import { FindProfileUseCase } from './modules/users/use-cases/find-profile.use-case';
import { UploadImageUseCase } from './modules/users/use-cases/upload-image.use-case';
import { S3FilesRepository } from './modules/adapters/AWS/s3-filesRepository';
import { PostsController } from './modules/posts/posts.controller';
import { CreatePostUseCase } from './modules/posts/use-cases/create-post.use-case';
import { PostsRepository } from './modules/posts/repository/posts.repository';
import { DeletePostByIdUseCase } from './modules/posts/use-cases/delete-post-by-id.use-case';
import { UpdatePostByIdUseCase } from './modules/posts/use-cases/update-post-by-id.use-case';
import { SocketServer } from './websocket/websocket.server';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { RecaptchaGuard } from './modules/auth/guards/recaptcha.guard';

const useCases = [
  UpdatePostByIdUseCase,
  DeletePostByIdUseCase,
  CreatePostUseCase,
  RegistrationUseCase,
  ConfirmationUseCase,
  EmailResendingUseCase,
  LoginUseCase,
  LogoutUseCase,
  DeleteAllDevicesByDeviceIdUseCase,
  DeleteAlldevicesUseCase,
  GetAlldevicesUseCase,
  RefreshTokenUseCase,
  PasswordRecoveryUseCase,
  NewPasswordUseCase,
  GoogleAuthUseCase,
  UploadFileUseCase,
  UpdateProfileUseCase,
  FindProfileUseCase,
  UploadImageUseCase,
];
const services = [
  PostsRepository,
  S3FilesRepository,
  AppService,
  PrismaService,
  EmailService,
  AuthService,
  GoogleStrategy,
  JwtService,
  UsersService,
];
const repositories = [
  AuthRepository,
  UsersRepository,
  EmailRepository,
  DevicesRepository,
];
const controllers = [
  PostsController,
  AppController,
  AuthController,
  UsersController,
  TestingController,
  DevicesController,
];

const throttlerGuard = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    CqrsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      ttl: 1,
      limit: 10,
    }),
    JwtModule.register({
      secret: JWT.jwt_secret,
      signOptions: { expiresIn: '600s' },
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
  ],
  controllers,
  providers: [
    ...useCases,
    ...services,
    ...repositories,
    SocketServer,
    LocalStrategy,
    JwtStrategy,
    RecaptchaGuard,
    throttlerGuard,
    JwtAuthGuard,
    LocalAuthGuard,
  ],
})
export class AppModule {}

import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileDto } from './dto/user-profile-dto';
import { CommandBus } from '@nestjs/cqrs';
import { User } from '../auth/decorator/request.decorator';
import { UserModel } from '../../../swagger/User/user.model';
import { UpdateProfileCommand } from './use-cases/update-profile.use-case';
import { UserProfileModel } from './types/types';
import { FindProfileCommand } from './use-cases/find-profile.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileCommand } from './use-cases/upload-file.use-case';
import { ApiFindProfileSwagger } from '../../../swagger/User/api-find-profile';
import { ApiCreateAvatarSwagger } from '../../../swagger/User/api-create-avatar';
import { ApiUpdateProfileSwagger } from '../../../swagger/User/api-update-profile';
import stripe, { Stripe } from 'stripe';
import * as process from 'process';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(public readonly commandBus: CommandBus) {}

  @Put('profile')
  @ApiUpdateProfileSwagger()
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @User() user: UserModel,
    @Body() dto: UserProfileDto,
  ): Promise<UserProfileModel> {
    return this.commandBus.execute(new UpdateProfileCommand(dto, user.id));
  }

  @Post('avatar')
  @ApiCreateAvatarSwagger()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageForProfile(
    @UploadedFile() photo: Express.Multer.File,
    @User() user: UserModel,
  ): Promise<{ photo: string }> {
    return this.commandBus.execute(new UploadFileCommand(user.id, photo));
  }

  @Get('profile')
  @ApiFindProfileSwagger()
  @UseGuards(JwtAuthGuard)
  async findProfileByUserId(
    @User() user: UserModel,
  ): Promise<UserProfileModel> {
    return this.commandBus.execute(new FindProfileCommand(user.id));
  }

  @Get('buy')
  async buyItems(@Query('productsIds') productsIds: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
    const session = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/users/success', // front end url after bue
      cancel_url: '',
      line_items: [
        {
          price_data: {
            product_data: {
              name: 'Products ids: ' + productsIds,
              description: 'Best product for happiness',
            },
            unit_amount: 100 * 100,
            currency: 'USD',
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });
  }
  @Get('success')
  async successPay() {
    return 'Yes, you buy was success';
  }
}

import { Controller, Delete, HttpCode } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiTestingAllDataSwagger } from '../../../swagger/Testing/api-testing-all-data';

@ApiTags('Clear data of DB')
@Controller('testing')
export class TestingController {
  constructor(private readonly prisma: PrismaService) {}

  @Delete('/all-data')
  @ApiTestingAllDataSwagger()
  @HttpCode(204)
  async deleteAllData() {
    return this.prisma.user.deleteMany();
  }
}

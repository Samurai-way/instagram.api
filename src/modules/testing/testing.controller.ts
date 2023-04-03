import { Controller, Delete, HttpCode } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('testing')
export class TestingController {
  constructor(private readonly prisma: PrismaService) {}

  @Delete('/all-data')
  @HttpCode(204)
  async deleteAllData() {
    return this.prisma.user.deleteMany();
  }
}

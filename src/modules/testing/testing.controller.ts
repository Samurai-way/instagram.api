import { Controller, Delete, HttpCode } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Clear data of DB')
@Controller('testing')
export class TestingController {
  constructor(private readonly prisma: PrismaService) {}

  @Delete('/all-data')
  @ApiOperation({
    summary: 'Clear all data of db',
  })
  @ApiResponse({
    status: 204,
    description: 'No content',
  })
  @HttpCode(204)
  async deleteAllData() {
    return this.prisma.user.deleteMany();
  }
}

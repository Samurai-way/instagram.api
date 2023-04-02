import { Body, Controller, HttpStatus, Post } from "@nestjs/common";

@Controller('auth')
export class AuthController{
  constructor() {}

  @Post('registration')
  @HttpStatus(204)
  async registration(@Body() dto: ){

  }
}
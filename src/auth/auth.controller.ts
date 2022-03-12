import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {} //this is a depency injection

  //here we define our endpoints
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    // signup(@Req() req: Request) {
    // we use a decorator to mention it's a request and because nest is on top of Express we can use the Express Request obj
    // but it's not good because if we use another framework like fastify and others we will need to refactor
    // we better use the @Body decorator with the dto in order to format and validate our body request
    // console.log(req);
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}

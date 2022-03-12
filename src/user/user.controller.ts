import {
  Body,
  Controller,
  Get,
  Patch,
  // Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
// import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me') // users/me
  getMe(@GetUser() user: User) {
    // if I want to retrieve only the email: @GetUSer('email') email: string
    // getMe(@Req() req: Request) {
    console.log(
      '!!!usersController:getMe:request:user',
      user,
    ); // returns what the validate() method returns in strategy
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}

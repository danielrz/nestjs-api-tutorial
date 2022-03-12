import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {}
}

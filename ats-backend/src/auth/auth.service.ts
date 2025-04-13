import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }

  private generateToken(user: { id: string; role: string }) {
    return {
      token: this.jwtService.sign({ id: user.id, role: user.role }),
    };
  }

  async signup(email: string, password: string, role: 'RECRUITER' | 'JOB_SEEKER') {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException('Email is already registered', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, role },
    })
    return {
      success: true,
      token: this.generateToken(user)
    };
  }
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return {
      success: true,
      role: user.role,
      token: this.generateToken(user)
    };
  }
}

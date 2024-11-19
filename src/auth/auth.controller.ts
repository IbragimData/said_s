import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard, RolesGuard } from './guards';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService,
        private readonly jwtService:JwtService
    ){}

    @Post("signup")
    async signup( @Body() dto:signupDto){
        return await this.authService.signup(dto)
    }

    @Post("login")
    async login(@Body() body: { email: string; password: string }) {
      return this.authService.login(body);
    }

    @Get('protected')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async protectedRoute() {
      return "ok"
    }

}



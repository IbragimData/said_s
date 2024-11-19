import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { login, signupDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService:PrismaService,
        private readonly jwtService:JwtService
    ){}

    async signup(dto:signupDto){
        const user = await this.prismaService.user.findFirst({
            where: {
                email: dto.email
            }
        })
        if(user){
            throw new BadRequestException()
        }
        return await this.prismaService.user.create({
            data: {
                ...dto
            }
        })
    }

    async login(dto:login){
        const user = await this.prismaService.user.findFirst({
            where: {
                email: dto.email
            }
        })
        if(!user){
            throw new BadRequestException()
        }

        if(user.password != dto.password){
            throw new BadRequestException
        }
        const payload = {email: user.email, sub:user.id, role: user.role} 
        return {
            token: this.jwtService.sign(payload)
        }
    }
}

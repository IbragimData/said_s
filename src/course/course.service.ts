import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCourseDto } from './dto';

@Injectable()
export class CourseService {
    constructor(
        private readonly prismaService:PrismaService
    ){}


    async getAll(){
        return await this.prismaService.course.findMany()
    }

    async getCourse(id:number){
        return await this.prismaService.course.findFirst({
            where: {
                id
            }
        })
    }

    async createCourse(dto: createCourseDto, banner:string | null, media:string | null){
        return await this.prismaService.course.create({
            data: {
                ...dto,
                banner,
                media
            }
        })
    }

    async updateCourse( id: number , dto: createCourseDto, banner:string | null, media:string | null){
         const course = await this.getCourse(id)
         if(!course){
            throw new BadRequestException()
         }
        return await this.prismaService.course.update({
            where: {
                id
            },
            data: {
                ...dto,
                banner,
                media
            }
        })
    }

    async deleteCourse(id:number){
        const course = await this.getCourse(id)
        if(!course){
            throw new BadRequestException()
        }
        console.log(course)
        return await this.prismaService.course.delete({
            where: {
                id: course.id
            }
        })
    }

    async getAllLesson(id:number){
        const course = await this.getCourse(id)
        if(!course){
            throw new BadRequestException()
        }

        return await this.prismaService.lesson.findMany({
            where: {
                courseId: id
            }
        })
    }

}

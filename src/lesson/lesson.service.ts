import { BadRequestException, Injectable } from '@nestjs/common';
import { createCourseDto } from 'src/course/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createLessonDto, updateLessonDto } from './dto';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class LessonService {
    constructor(
        private readonly prismaService:PrismaService,
        private readonly courseService:CourseService
    ){}

    async getLesson(id:number){
        return await this.prismaService.lesson.findFirst({
            where: {
                id
            }
        })
    }
    async createLesson(dto:createLessonDto, media:string, id:number){
        const course = await this.courseService.getCourse(id)
        if(!course){
            throw new BadRequestException()
        }
        return await this.prismaService.lesson.create({
            data: {
                ...dto,
                courseId: id,
                media
            }
        })
    }
    async updateLesson(id:number, dto:updateLessonDto, media:string | null){
        return await this.prismaService.lesson.update({
            where: {
                id
            },
            data: {
                ...dto,
                media
            }
        })
    }

    async deleteLesson(id:number){
        const lesson = await this.getLesson(id)
        if(!lesson){
            throw new BadRequestException()
        }
        return await this.prismaService.lesson.delete({
            where: {
                id
            },
            select: {
                id:true
            }
        })
    }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CourseService } from 'src/course/course.service';
import { createLessonDto, updateLessonDto } from './dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { writeFileSync } from 'fs';
import * as path from 'path';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';

@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService:LessonService,
        private readonly courseService:CourseService
    ){}

    @Get(":id")
    async getOneLesson(@Param("id", ParseIntPipe) id:number){
        return await this.lessonService.getLesson(id)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileFieldsInterceptor([
        {name: "media", maxCount: 1}
    ]))
    @Post(":id")
    async getLesson(@Param("id", ParseIntPipe) id:number, @Body() dto:createLessonDto, @UploadedFiles() files: {media?: Express.Multer.File}){
        
        const course = await this.courseService.getCourse(id)
        console.log(course)
        const media = files.media && files.media[0]
        let mediaName:string | null = null
        if(media){
            mediaName = new Date().toISOString() + ".jpg"
            writeFileSync(path.join(__dirname, "..", "upload", `${mediaName}`), media.buffer)
        }
        return await this.lessonService.createLesson(dto, mediaName, id)
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileFieldsInterceptor([
        {name: "media", maxCount: 1}
    ]))
    @Patch(":id")
    async updateLesson(@Param("id", ParseIntPipe) id:number, @Body() dto:updateLessonDto, @UploadedFiles() files: {media?: Express.Multer.File}){
        const course = await this.courseService.getCourse(id)
        console.log(dto)
        console.log(id)
        console.log(course)
        const media = files.media && files.media[0]
        console.log(media)
        let mediaName:string | null = null
        if(media){
            mediaName = new Date().toISOString() + ".jpg"
            writeFileSync(path.join(__dirname, "..", "upload", `${mediaName}`), media.buffer)
        }
        return await this.lessonService.updateLesson(id, dto, mediaName)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    async deleteLesson(@Param("id", ParseIntPipe) id:number){
        return await this.lessonService.deleteLesson(id)
    }
    
}

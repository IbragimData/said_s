import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CourseService } from './course.service';
import { createCourseDto } from './dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('course')
export class CourseController {
    constructor(
        private readonly courseService:CourseService
    ){}

    @Get(":id")
    async getCourse(@Param("id", ParseIntPipe) id:number){
        return await this.courseService.getCourse(id)
    }
    @Get("")
    async getAll(){
        return await this.courseService.getAll()
    }

    @Get("/lesson/:id")
    async getLesson(@Param("id", ParseIntPipe) id:number){
      return await this.courseService.getAllLesson(id)
  }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileFieldsInterceptor([
        {name: "banner", maxCount: 1},
        {name: "media", maxCount: 1}
    ]))
    @Post()
    async createCourse(@Body() dto:createCourseDto, @UploadedFiles() files: {banner? : Express.Multer.File[], media? : Express.Multer.File[]}){
        console.log(dto),
        console.log(files.banner)
        console.log(files.media)
        const bannerFile = files.banner && files.banner[0];
        const mediaFile = files.media && files.media[0];
        let bannerName:string | null = null
        let mediaName:string | null = null

        const uploadDir = path.join(__dirname, '..', 'upload');

        // Проверка наличия папки и создание, если её нет
        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true });
        }
    
        if (bannerFile) {
            bannerName = "banner-" + new Date().toISOString()
          const bannerPath = path.join(__dirname, '..', 'upload', `${bannerName}.jpg`);
          writeFileSync(bannerPath, bannerFile.buffer);
        }
        if (mediaFile) {
            mediaName = "media-" + new Date().toISOString()
          const mediaPath = path.join(__dirname, '..', 'upload', `${mediaName}.jpg`);
          writeFileSync(mediaPath, mediaFile.buffer);
        }
        
        return await this.courseService.createCourse(dto, bannerName, mediaName)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileFieldsInterceptor([
        {name: "banner", maxCount: 1},
        {name: "media", maxCount: 1}
    ]))
    @Patch(":id")
    async updateCourse(@Param("id", ParseIntPipe) id:number, @Body() dto:createCourseDto, @UploadedFiles() files: {banner? : Express.Multer.File[], media? : Express.Multer.File[]}){
        console.log(dto),
        console.log(files.banner)
        console.log(files.media)
        const bannerFile = files.banner && files.banner[0];
        const mediaFile = files.media && files.media[0];
        let bannerName:string | null = null
        let mediaName:string | null = null

        const uploadDir = path.join(__dirname, '..', 'upload');

        // Проверка наличия папки и создание, если её нет
        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true });
        }
    
        if (bannerFile) {
            bannerName = "banner-" + new Date().toISOString() + ".jpg"
          const bannerPath = path.join(__dirname, '../upload', `${bannerName}.jpg`);
          writeFileSync(bannerPath, bannerFile.buffer);
        }
        if (mediaFile) {
            mediaName = "media-" + new Date().toISOString() + ".jpg"
          const mediaPath = path.join(__dirname, '..', 'upload', `${mediaName}`);
          writeFileSync(mediaPath, mediaFile.buffer);
        }
        
        return await this.courseService.updateCourse(id, dto, bannerName, mediaName)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    async deleteCourse(@Param("id", ParseIntPipe) id:number){
        console.log(id)
        return await this.courseService.deleteCourse(id)
    }
}
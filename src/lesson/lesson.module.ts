import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { CourseService } from 'src/course/course.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [LessonService, CourseService, PrismaService],
  controllers: [LessonController]
})
export class LessonModule {}

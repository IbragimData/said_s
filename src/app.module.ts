import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [PrismaModule, CourseModule, LessonModule, AuthModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, ".", "upload"),
    serveRoot: "/static"
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Type } from "class-transformer"
import { IsNumber, IsString } from "class-validator"

export class createLessonDto{
    @IsString()
    title: string
    @IsString()
    content: string
}
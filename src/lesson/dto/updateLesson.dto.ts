import { Type } from "class-transformer"
import { IsNumber, IsString } from "class-validator"

export class updateLessonDto{
    title: string
    content: string
}
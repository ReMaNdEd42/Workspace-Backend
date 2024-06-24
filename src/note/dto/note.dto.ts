import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class NoteDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    drawables: Array<any>
}
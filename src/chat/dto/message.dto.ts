import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, Length, ValidateNested } from "class-validator";

export class MessageDto {

    @IsNotEmpty()
    @IsString()
    message: string;

}
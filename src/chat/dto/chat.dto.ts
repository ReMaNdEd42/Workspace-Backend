import { ArrayMinSize, IsArray, IsNotEmpty, IsString} from "class-validator";

export class ChatDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsArray()
    @IsNotEmpty()
    @ArrayMinSize(1)
    members: Array<number>;
}
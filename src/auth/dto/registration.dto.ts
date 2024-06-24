import { IsNotEmpty, IsString } from "class-validator";

export class RegistrationDto {
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}
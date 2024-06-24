import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class AutomationDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsString()    
    code: string;

    @IsString()    
    description: string;

    @IsBoolean()    
    status: boolean;
}
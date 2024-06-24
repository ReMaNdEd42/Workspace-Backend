import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AppointmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    note: string;

    @IsInt()
    @IsNotEmpty()
    startTime: number;

    @IsInt()
    @IsNotEmpty()
    endTime: number;
}
// name, note, startTime, endTime
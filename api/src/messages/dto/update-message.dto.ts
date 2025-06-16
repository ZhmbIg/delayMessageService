import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateMessageDTO {
    @IsOptional()
    @IsString({ message: 'text must be a string' })
    content?: string;

    @IsOptional()
    @IsDateString({}, { message: 'sendAt must be a valid ISO date string' })
    scheduleTime?: Date;

}
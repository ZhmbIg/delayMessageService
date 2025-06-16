import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDTO {
    @IsOptional()
    @IsEmail()
    email?: string;
    
    @IsOptional()
    @IsString({ message: 'telegramId must be a string' })
    telegramId?: string;
}
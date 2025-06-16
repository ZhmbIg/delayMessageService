import { IsEmail, IsString } from "class-validator";

export class CreateUserDTO {
    @IsEmail({}, {message: 'email must be a valid email address'})
    email: string;
    @IsString({ message: 'telegramId must be a string' })
    telegramId: string;
}
import { IsEmail, IsString, Length } from "class-validator";

export class LoginDTO{
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @Length(6, 20)
    @IsString({ message: 'Password must be a string' })
    password: string;
}
import { IsEmail, IsEnum, IsOptional, IsString, Length } from "class-validator"
import { EnumRoles } from "src/common/enum/EnumRoles.enum"

export class RegisterDTO {
    @IsEmail({},{message: 'Email must be a valid email address'})
    email: string

    @Length(6, 20)
    @IsString({message: 'Password must be a string'})
    password: string

    @IsOptional()
    @IsEnum(EnumRoles, {message: 'Role must be either user or admin'})
    role?: EnumRoles
}
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class LoginUserDto{

    @ApiProperty({
            type: String,
            description: "El nombre del usuario",
            required: true,
        })
    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    @MinLength(3)
    username: string;


    @ApiProperty({
            type: String,
            description: "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)",
            required: true,
    })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&*])[A-Za-z\d=!@#$%^&*]{8,15}$/,
        {
        message: "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial (!@#$%^&*)"
    }
)
    @IsNotEmpty()
    @IsString()
    password: string;
}
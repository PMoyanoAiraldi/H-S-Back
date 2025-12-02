import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,  IsNumber,  IsString } from "class-validator";

export class CreateRubroDto {
    
    @ApiProperty({ description: "El nombre del rubro", required: true})
    @IsString()
    @IsNotEmpty()
    nombre: string;


    @ApiProperty({ description: "El código del rubro", required: true})
    @IsNumber()
    @IsNotEmpty()
    codigo: number;

}
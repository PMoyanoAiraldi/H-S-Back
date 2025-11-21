import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,  IsNumber,  IsString } from "class-validator";

export class CreateLineaDto {
    
    @ApiProperty({ description: "El nombre de la linea", required: true})
    @IsString()
    @IsNotEmpty()
    nombre: string;


    @ApiProperty({ description: "El código de la linea", required: true})
    @IsNumber()
    @IsNotEmpty()
    codigo: number;

}
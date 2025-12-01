import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,  IsNumber,  IsString } from "class-validator";

export class CreateMarcaDto {
    
    @ApiProperty({ description: "El nombre de la marca", required: true})
    @IsString()
    @IsNotEmpty()
    nombre: string;


    @ApiProperty({ description: "El código de la marca", required: true})
    @IsNumber()
    @IsNotEmpty()
    codigo: number;

}
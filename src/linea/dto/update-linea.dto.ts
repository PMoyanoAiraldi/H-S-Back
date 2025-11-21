import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty,  IsNumber,  IsOptional,  IsString, IsUUID } from "class-validator";

export class UpdateLineaDto {
    
    @ApiProperty({ description: "El nombre de la linea", required: true})
    @IsString()
    @IsNotEmpty()
    nombre?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary', 
        description: 'Imagen de la linea del producto',
    })
    image?: string;


    @ApiProperty({ description: "El código de la linea", required: true})
    @IsNumber()
    @IsNotEmpty()
    codigo: number;

    @ApiProperty({ description: "Estado de la linea", required: false })
    @IsOptional()
    @IsBoolean()
    state?: boolean; 

}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class ResponseProductDto {

    @ApiProperty({ description: "ID del producto" })
    id: string;


    @ApiProperty({ description: "El nombre del producto", required: true })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: "El codigo del producto", required: true })
    @IsNumber()
    @IsNotEmpty()
    codigo: number; 

    @ApiProperty({ description: "La descripción del producto", required: true })
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @ApiProperty({ description: "El código ALt1 del producto", required: true })
    @IsString()
    @IsOptional()
    codigoAlternativo1: string;

    @ApiProperty({ description: "El código ALt2 del producto", required: true })
    @IsString()
    @IsOptional()
    codigoAlternativo2: string;


    // @ApiProperty({ description: "Stock del producto" })
    // stock: number;


    @ApiProperty({
        type: 'string',
        format: 'binary', 
        description: 'Imagen del producto',
    })
    imgUrl?: string;

    @ApiProperty({ description: "Estado del producto" })
    state: boolean;

    @ApiProperty({ description: "Nombre de la marca del producto" })
    marcaNombre: string;

    @ApiProperty({ description: "Nombre de la linea del producto" })
    lineaNombre: string;

    @ApiProperty({ description: "Nombre del rubro del producto" })
    rubroNombre: string;

    @ApiProperty({ description: "Nombre del sub rubro del producto" })
    subRubroNombre: string;

}

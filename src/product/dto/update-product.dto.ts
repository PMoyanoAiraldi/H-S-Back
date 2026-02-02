import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class UpdateProductDto {

    @ApiProperty({ description: "El nombre del producto", required: true })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiProperty({ description: "La descripción del producto", required: true })
    @IsString()
    @IsOptional()
    descripcion?: string;

    @ApiProperty({ description: "El código del producto", required: false })
    @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
    @IsNumber()
    @IsOptional()
    codigo?: number;
    
    
    @ApiProperty({ description: "El código Alternativo1 del producto", required: false })
    @IsString()
    @IsOptional()
    codigoAlternativo1?: string; // Del CSV "Articulos" - Columna "CodigoAlternativo1"
    
    
    @ApiProperty({ description: "El Alternativo2 del producto", required: false })
    @IsString()
    @IsOptional()
    codigoAlternativo2?: string; 


    // @ApiProperty({ description: 'La cantidad de stock del producto', example: 300,})
    // @IsNumber()
    // @IsOptional()
    // @IsPositive({ message: 'El stock debe ser un número positivo.' })
    // stock?: number;

    // @ApiProperty({
    //     type: 'string',
    //     format: 'binary', 
    //     description: 'Imagen del producto',
    // })
    // imgUrl?: string;

    @ApiProperty({ description: "Estado del producto", required: false })
    @IsOptional()
    @IsBoolean()
    state?: boolean;

    @ApiProperty({ 
        description: "El ID de la marca del producto", 
        required: true,
        example: "550e8400-e29b-41d4-a716-446655440000"
    })
    @IsUUID('4', { message: 'El ID de la marca debe ser un UUID válido.' })
    @IsOptional()
    marcaId?: string;

    @ApiProperty({ 
        description: "El ID de la línea del producto", 
        required: false,
        example: "550e8400-e29b-41d4-a716-446655440001"
    })
    @IsUUID('4', { message: 'El ID de la línea debe ser un UUID válido.' })
    @IsOptional()
    lineaId?: string;

    @ApiProperty({ 
        description: "El ID del rubro del producto", 
        required: true,
        example: "550e8400-e29b-41d4-a716-446655440002"
    })
    @IsUUID('4', { message: 'El ID del rubro debe ser un UUID válido.' })
    @IsNotEmpty()
    rubroId?: string;

    @ApiProperty({ 
        description: "El precio del producto", 
        required: false,
        example: 1000.50
    })
    @Transform(({ value }) => value ? parseFloat(value) : undefined)
    @IsNumber()
    @IsOptional()
    precio?: number;

    @ApiProperty({ 
        description: "Lista de precio (número de lista)", 
        required: false,
        example: 1
    })
    @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
    @IsNumber()
    @IsOptional()
    listaPrecio?: number;

}

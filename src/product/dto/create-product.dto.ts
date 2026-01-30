import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateProductDto {

    @ApiProperty({ description: "El nombre del producto", required: true })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ description: "La descripción del producto", required: true })
    @IsString()
    @IsOptional()
    descripcion: string;

    @ApiProperty({ description: "El código del producto" })
    @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
    @IsNumber()
    @IsOptional()
    codigo?: number;
    
    
    @ApiProperty({ description: "El código Alternativo1 del producto" })
    @IsString()
    @IsOptional()
    codigoAlternativo1?: string; // Del CSV "Articulos" - Columna "CodigoAlternativo1"
    
    
    @ApiProperty({ description: "El Alternativo2 del producto" })
    @IsString()
    @IsOptional()
    codigoAlternativo2?: string; 


    // @ApiProperty({ description: 'La cantidad de stock del producto', example: 300,})
    // @Transform(({ value }) => {
    //     // Convertir string a número si es necesario
    //     const num = typeof value === 'string' ? parseInt(value) : value;
    //     return isNaN(num) ? value : num;
    // })
    // @IsPositive({ message: 'El stock debe ser un número positivo.' })
    // @IsNumber({}, { message: 'El stock debe ser un número válido.' })
    // stock: number;

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
    @IsOptional()
    rubroId?: string;

    // @ApiProperty({ 
    //     description: "El ID del subrubro del producto", 
    //     required: false,
    //     example: "550e8400-e29b-41d4-a716-446655440003"
    // })
    // @IsUUID('4', { message: 'El ID del subrubro debe ser un UUID válido.' })
    // @IsOptional()
    // subrubroId?: string;

    @ApiProperty({ 
        description: "El precio del producto", 
        required: false,
        example: 1000.50
    })
    @Transform(({ value }) => value ? parseFloat(value) : undefined)
    @IsNumber()
    @IsOptional()
    precio?: number; //Solo para transportar datos

    @ApiProperty({ 
        description: "Lista de precio (número de lista)", 
        required: false,
        example: 1
    })
    @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
    @IsNumber()
    @IsOptional()
    listaPrecio?: number; //Solo para transportar datos

    @ApiProperty({ 
        description: "El ID del precio del producto", 
        required: true,
        example: "550e8400-e29b-41d4-a716-446655440004"
    })
    @IsUUID('4', { message: 'El ID del precio debe ser un UUID válido.' })
    @IsOptional()
    precioId?: string;


    @ApiProperty({ 
        description: "URL de la imagen del producto", 
        required: false,
        example: "default-image-url.jpg"
    })
    @IsString()
    @IsOptional()
    imgUrl?: string;

}

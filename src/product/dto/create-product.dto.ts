import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateProductDto {

    @ApiProperty({ description: "El nombre del producto", required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "La descripción del producto", required: true })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'El precio del producto', example: 250.50,})
    @Transform(({ value }) => {
        // Convertir string a número si es necesario
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? value : num;
    })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con hasta dos decimales.' })
    @IsPositive({ message: 'El precio debe ser un número positivo.' })
    price: number;

    @ApiProperty({ description: 'La cantidad de stock del producto', example: 300,})
    @Transform(({ value }) => {
        // Convertir string a número si es necesario
        const num = typeof value === 'string' ? parseInt(value) : value;
        return isNaN(num) ? value : num;
    })
    @IsPositive({ message: 'El stock debe ser un número positivo.' })
    @IsNumber({}, { message: 'El stock debe ser un número válido.' })
    stock: number;

    
    @ApiProperty({ 
        description: 'ID de la categoría a la que pertenece el producto', 
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        required: true
    })
    @IsUUID('4', { message: 'El categoryId debe ser un UUID válido.' })
    categoryId: string;
}

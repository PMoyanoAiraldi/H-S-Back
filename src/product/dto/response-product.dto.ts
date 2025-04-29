import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class ResponseProductDto {

    @ApiProperty({ description: "El nombre del producto", required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "La descripción del producto", required: true })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'El precio del producto', example: 250.50,})
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número con hasta dos decimales.' })
    @IsPositive({ message: 'El precio debe ser un número positivo.' })
    price: number;

    @ApiProperty({ description: 'La cantidad de stock del producto', example: 300,})
    @IsNumber()
    @IsPositive({ message: 'El stock debe ser un número positivo.' })
    stock: number;

    @ApiProperty({
        type: 'string',
        format: 'binary', 
        description: 'Imagen del producto',
    })
    imgUrl?: any;

    
    @ApiProperty({ 
        description: 'ID de la categoría a la que pertenece el producto', 
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        required: true
    })
    @IsUUID('4', { message: 'El categoryId debe ser un UUID válido.' })
    categoryId: string;
}

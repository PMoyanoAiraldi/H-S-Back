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

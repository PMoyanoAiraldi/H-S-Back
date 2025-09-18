import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class ResponseProductDto {

    @ApiProperty({ description: "ID del producto" })
    id: string;


    @ApiProperty({ description: "El nombre del producto", required: true })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "La descripción del producto", required: true })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: "Precio del producto" })
    price: number;

    @ApiProperty({ description: "Stock del producto" })
    stock: number;


    @ApiProperty({
        type: 'string',
        format: 'binary', 
        description: 'Imagen del producto',
    })
    imgUrl?: string;

    @ApiProperty({ description: "Estado del producto" })
    state: boolean;

    @ApiProperty({ 
        description: 'ID de la categoría a la que pertenece el producto', 
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        required: true
    })
    @IsUUID('4', { message: 'El categoryId debe ser un UUID válido.' })
    categoryId: string;
    
    @ApiProperty({ description: "Nombre de la categoría" })
    categoryName: string;

    static fromEntity(product: any): ResponseProductDto {
        const dto = new ResponseProductDto();
        dto.id = product.id;
        dto.name = product.name;
        dto.description = product.description;
        dto.price = product.price;
        dto.stock = product.stock;
        dto.imgUrl = product.imgUrl;
        dto.state = product.state;
        dto.categoryId = product.category?.id;
        dto.categoryName = product.category?.name;
        return dto;
    }
}

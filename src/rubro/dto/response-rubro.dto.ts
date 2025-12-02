import { ApiProperty } from "@nestjs/swagger";
import { ResponseProductDto } from "src/product/dto/response-product.dto";

export class ResponseRubroDto {
    
    @ApiProperty({
        type: Number,
        description: "El identificador del rubro",
        required: true,
    })
    codigo: number;

    @ApiProperty({
        type: String,
        description: "El nombre del rubro",
        required: true,
    })
    nombre: string;


    @ApiProperty({
        type: [ResponseProductDto],
        description: "El nombre del rubro",
        required: true,
    })
    productos: ResponseProductDto[];

}
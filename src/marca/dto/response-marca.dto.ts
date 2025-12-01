import { ApiProperty } from "@nestjs/swagger";
import { ResponseProductDto } from "src/product/dto/response-product.dto";

export class ResponseMarcaDto {
    
    @ApiProperty({
        type: Number,
        description: "El identificador de la marca",
        required: true,
    })
    codigo: number;

    @ApiProperty({
        type: String,
        description: "El nombre de la marca",
        required: true,
    })
    nombre: string;


    @ApiProperty({
        type: [ResponseProductDto],
        description: "El nombre de la marca",
        required: true,
    })
    productos: ResponseProductDto[];

}
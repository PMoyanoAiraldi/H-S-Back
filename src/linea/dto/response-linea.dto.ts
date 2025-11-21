import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,  IsString, IsUUID } from "class-validator";
import { ResponseProductDto } from "src/product/dto/response-product.dto";
import { Products } from "src/product/product.entity";

export class ResponseLineaDto {
    
    @ApiProperty({
        type: Number,
        description: "El identificador de la linea",
        required: true,
    })
    codigo: number;

    @ApiProperty({
        type: String,
        description: "El nombre de la linea",
        required: true,
    })
    nombre: string;


    @ApiProperty({
        type: [ResponseProductDto],
        description: "El nombre de la linea",
        required: true,
    })
    productos: ResponseProductDto[];

    // constructor(id: string, nombre: string) {
    //     this.id = id;
    //     this.nombre = nombre;
    // }
}
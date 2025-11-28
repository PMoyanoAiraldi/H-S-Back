import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { Products } from "../product.entity";

export class ResponseProductDto {

    @ApiProperty({ description: "ID del producto" })
    id: string;

    @ApiProperty({ description: "El nombre del producto", required: true })
    nombre: string;

    @ApiProperty({ description: "El codigo del producto", required: true })
    codigo: number; 

    @ApiProperty({ description: "La descripción del producto", required: true })
    descripcion: string;

    @ApiProperty({ description: "El código ALt1 del producto", required: true })
    codigoAlternativo1?: string;

    @ApiProperty({ description: "El código ALt2 del producto", required: true })
    codigoAlternativo2?: string;


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
    lineaNombre?: string;

    @ApiProperty({ description: "Nombre del rubro del producto" })
    rubroNombre: string;

    @ApiProperty({ description: "Nombre del sub rubro del producto" })
    subRubroNombre?: string;

    @ApiProperty({ 
        description: "Precios del producto",
        type: 'array',
        required: false,
        example: [{
            id: "550e8400-e29b-41d4-a716-446655440004",
            listaPrecio: 1,
            precio: 1500.00,
            updatedAt: "2024-01-20T14:45:00Z"
        }]
    })
    precios?: Array<{
        id: string;
        listaPrecio: number;
        precio: number;
        updatedAt: Date;
    }>;

    @ApiProperty({ description: "Fecha de creación", example: "2024-01-15T10:30:00Z" })
    createdAt?: Date;

    @ApiProperty({ description: "Fecha de última actualización", example: "2024-01-20T14:45:00Z" })
    updatedAt?: Date;

     // MÉTODO ESTÁTICO 
    static fromEntity(product: Products): ResponseProductDto {
        const dto = new ResponseProductDto();
        dto.id = product.id;
        dto.nombre = product.nombre;
        dto.codigo = product.codigo;
        dto.descripcion = product.descripcion;
        dto.codigoAlternativo1 = product.codigoAlternativo1;
        dto.codigoAlternativo2 = product.codigoAlternativo2;
        dto.imgUrl = product.imgUrl;
        dto.state = product.state;
        dto.marcaNombre = product.marca?.nombre || '';
        dto.lineaNombre = product.linea?.nombre || '';
        dto.rubroNombre = product.rubro?.nombre || '';
        //dto.subRubroNombre = product.subRubro?.nombre || '';

        // Mapear precios si existen
        dto.precios = product.precios?.map(precio => ({
            id: precio.id,
            listaPrecio: precio.listaPrecio,
            precio: precio.precio,
            updatedAt: precio.updatedAt
        })) || [];

        // Incluir fechas de auditoría
        dto.createdAt = product.createdAt;
        dto.updatedAt = product.updatedAt;

        return dto;
    }

}

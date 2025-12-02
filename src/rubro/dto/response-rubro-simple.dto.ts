import { ApiProperty } from "@nestjs/swagger";


export class ResponseRubroSimpleDto {
    
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

}
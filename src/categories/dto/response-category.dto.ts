import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,  IsString, IsUUID } from "class-validator";

export class ResponseCategoryDto {
    
    @ApiProperty({ description: "El nombre de la categoria", required: true})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: 'string',
        format: 'binary', 
        description: 'Imagen de la categoria del producto',
    })
    image?: string;

}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,  IsString, IsUUID } from "class-validator";

export class ResponseCategoryDto {
    
    @ApiProperty({
        type: String,
        description: "El identificador único de la categoría",
        required: true,
    })
    id: string;

    @ApiProperty({
        type: String,
        description: "El nombre de la categoría",
        required: true,
    })
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
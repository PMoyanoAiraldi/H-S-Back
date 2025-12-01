import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty,  IsNumber,  IsOptional,  IsString, IsUUID } from "class-validator";

export class UpdateMarcaDto {
    
    @ApiProperty({ description: "El nombre de la marca", required: true})
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiProperty({ description: "El código de la marca", required: true})
    @IsNumber()
    @IsOptional()
    codigo?: number;

    @ApiProperty({ description: "Estado de la marca", required: false })
    @IsOptional()
    @IsBoolean()
    state?: boolean; 

}
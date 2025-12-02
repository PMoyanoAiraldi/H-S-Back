import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty,  IsNumber,  IsOptional,  IsString, IsUUID } from "class-validator";

export class UpdateRubroDto {
    
    @ApiProperty({ description: "El nombre del rubro", required: true})
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiProperty({ description: "El código del rubro", required: true})
    @IsNumber()
    @IsOptional()
    codigo?: number;

    @ApiProperty({ description: "Estado del rubro", required: false })
    @IsOptional()
    @IsBoolean()
    state?: boolean; 

}
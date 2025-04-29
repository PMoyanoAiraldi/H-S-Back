import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateStateDto {
    @ApiProperty({
        description: 'Indica si el producto está habilitado (true) o deshabilitado (false)',
        example: true, 
    })
    @IsBoolean()
    state: boolean;
}
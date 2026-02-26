import { AplicacionService } from "./aplicacion.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Get } from "@nestjs/common";
import { Aplicacion } from "./aplicacion.entity";

@ApiTags('Aplicacion')
@Controller('aplicacion')
export class AplicacionController {
    constructor(private readonly aplicacionService: AplicacionService) {}

    @Get()
    @ApiOperation({ summary: 'Obtener todas las aplicaciones' })
    @ApiResponse({ status: 200, description: 'Aplicaciones obtenidas', type: [Aplicacion] })
    async findAll(): Promise<Aplicacion[]> {
        return this.aplicacionService.findAll();
    }

}

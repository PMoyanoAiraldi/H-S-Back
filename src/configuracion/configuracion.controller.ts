import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ConfiguracionService } from "./configuracion.service";
import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guard/roles.guard";
import { AuthGuard } from "src/guard/auth.guard";


@ApiTags('Configuracion')
@Controller('configuracion')
export class ConfiguracionController {
    constructor(private readonly configuracionService: ConfiguracionService) {}

@Get('tipo-cambio')
    getTipoCambio() {
        return this.configuracionService.get('tipo_cambio');
    }

@Put('tipo-cambio')
@Roles('admin')
@UseGuards(AuthGuard, RolesGuard)
    updateTipoCambio(@Body('valor') valor: number) {
        return this.configuracionService.set('tipo_cambio', valor);
    }
}
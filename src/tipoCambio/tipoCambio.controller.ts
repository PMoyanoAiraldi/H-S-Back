import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TipoCambioService } from './tipoCambio.service';
import { AuthGuard } from "src/guard/auth.guard";
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';


@Controller('tipo-cambio')
export class TipoCambioController {

    constructor(private readonly tipoCambioService: TipoCambioService) {}

    
    // Cualquiera puede leerlo (el cliente también lo necesita para ver el precio)
    @Get()
    getActual() {
        return this.tipoCambioService.getActual();
    }

    // Solo el admin puede actualizar el TC del día
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin') 
    upsertHoy(@Body() body: { valor: number }) {
        return this.tipoCambioService.upsertHoy(body.valor);
    }
}
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TipoCambioService } from './tipoCambio.service';
import { AuthGuard } from "src/guard/auth.guard";


@Controller('tipo-cambio')
export class TipoCambioController {

    constructor(private readonly tipoCambioService: TipoCambioService) {}

    // GET /tipo-cambio
    // Cualquiera puede leerlo (el cliente también lo necesita para ver el precio)
    @Get()
    getActual() {
        return this.tipoCambioService.getActual();
    }

    // POST /tipo-cambio
    // Solo el admin puede actualizar el TC del día
    @Post()
    @UseGuards(AuthGuard) 
    upsertHoy(@Body() body: { valor: number }) {
        return this.tipoCambioService.upsertHoy(body.valor);
    }
}
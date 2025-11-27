import { Controller } from "@nestjs/common";
import { PrecioService } from "./precio.service";



@Controller("Precio")
export class PrecioController {
    constructor(
        private readonly precioService: PrecioService,
    ) { }
}
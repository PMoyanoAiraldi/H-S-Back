import { Controller } from "@nestjs/common";
import { MarcaService } from "./marca.service";


@Controller("Marca")
export class MarcaController {
    constructor(
        private readonly marcaService: MarcaService,
    ) { }
}
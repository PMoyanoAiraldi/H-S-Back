import { Controller } from "@nestjs/common";
import { RubroService } from "./rubro.service";


@Controller("Rubro")
export class RubroController {
    constructor(
        private readonly rubroService: RubroService,
    ) { }
}
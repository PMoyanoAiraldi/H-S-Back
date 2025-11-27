import { Controller } from "@nestjs/common";
import { SubRubroService } from "./subRubro.service";

@Controller("subRubro")
export class SubRubroController {
    constructor(
        private readonly subRubroService: SubRubroService,
    ) { }
}
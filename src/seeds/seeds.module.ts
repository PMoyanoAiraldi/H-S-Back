import { Module, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedUsers } from './users.seed';
import { seedProduct } from './product.seed';
import { seedLinea } from './linea.seed';

@Module({})
export class SeedModule implements OnModuleInit {
    constructor(private dataSource: DataSource) {}

    async onModuleInit() {

        await seedLinea(this.dataSource);
        // await seedProduct(this.dataSource)
        // await seedUsers(this.dataSource); 
        
    }
}

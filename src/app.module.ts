import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { postgresDataSourceConfig } from './config/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { UserModule } from './user/users.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { OrderProductModule } from './orderProduct/orderProduct.module';
import { AuthModule } from './auth/auth.module';
import { LineaModule } from './linea/linea.module';
import { MarcaModule } from './marca/marca.module';
import { RubroModule } from './rubro/rubro.module';
import { SubRubroModule } from './subRubro/subRubro.module';
import { PrecioModule } from './precio/precio.module';
import { SeedModule } from './seeds/seeds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ postgresDataSourceConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<DataSourceOptions> => {
        const config = configService.get<DataSourceOptions>('postgres');
        if (!config) throw new Error('Postgres config not found');
        return config;
      }
    }),
    UserModule,
    ProductModule,
    OrderModule,
    OrderProductModule,
    LineaModule,
    AuthModule,
    MarcaModule,
    RubroModule,
    SubRubroModule,
    PrecioModule,
    SeedModule
  
  ],
controllers: [AppController],
providers: [AppService],
exports: []
})

export class AppModule {}
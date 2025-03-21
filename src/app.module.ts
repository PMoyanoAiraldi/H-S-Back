import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { postgresDataSourceConfig } from './config/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

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
  
  ],
controllers: [AppController],
providers: [AppService],
exports: []
})

export class AppModule {}
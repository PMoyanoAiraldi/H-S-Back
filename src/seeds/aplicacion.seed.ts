import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Aplicacion } from 'src/aplicacion/aplicacion.entity';
import { DataSource, Repository } from 'typeorm';


export const seedAplicacion = async (dataSource: DataSource) => {
    const aplicacionRepository = dataSource.getRepository(Aplicacion);


        const aplicaciones = [
            {
                codigo: 1,
                nombre: 'Cosechadoras',
                imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758830951/Cosechadora_hbnd69.png',
            },
            {
                codigo: 2,
                nombre: 'Pulverizadores',
                imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1759957514/pulverizador_vwlui0.png',
            },
            {
                codigo: 3,
                nombre: 'Sembradoras',
                imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758835708/sembradora-agp-3_tuwxoz.png',
            },
            {
                codigo: 4,
                nombre: 'Tractores',
                imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758831134/Tractor_ysnnje.png',
            },
            {
                codigo: 5,
                nombre: 'Ognibene Power',
                imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1761083289/Ognibene_power_recortado_cmyyxq.png',
            },
        ];

        for (const data of aplicaciones) {
            const existe = await aplicacionRepository.findOne({
                where: { codigo: data.codigo }
            });

            if (!existe) {
                const aplicacion = aplicacionRepository.create(data);
                await aplicacionRepository.save(aplicacion);
                console.log(`✅ Aplicacion creada: ${data.nombre}`);
            } else {
                console.log(`⏭️ Ya existe: ${data.nombre}`);
            }
        }
    }

import { Linea } from 'src/linea/linea.entity';
import { DataSource, getRepository } from 'typeorm';




export const seedLinea = async (dataSource: DataSource) => {
    const lineaRepository = dataSource.getRepository(Linea);
    
    const linea = [
    {
        codigo: 319,   
        nombre: 'BOMBAS A PISTONES REXROTH',
        imgUrl: 'default-image-url.jpg',
    },
    {
        codigo: 12,
        nombre: 'MANGUERAS HIDRAULICAS',
        imgUrl: 'default-image-url.jpg',
    },
    {
        codigo: 21,
        nombre: 'MOTOR ORBITAL M+S',
        imgUrl: 'default-image-url.jpg',
    },
    {
        codigo: 26, 
        nombre: 'VALVULAS',
        imgUrl: 'default-image-url.jpg',
    },
    {
        codigo: 11,
        nombre: 'CILINDROS HIDRAULICOS  Y  REPUESTOS',
        imgUrl: 'default-image-url.jpg',
    },
];

  // Insertar lineas si no existen
    for (const lineas of linea) {
        const existingLinea = await lineaRepository.findOne({
        where: { codigo: lineas.codigo },
        });

        if (!existingLinea) {
        await lineaRepository.save(lineas);
        console.log(`La linea "${lineas.nombre}" no existe y se insertará.`);
        } else {
        console.log(`La linea "${lineas.nombre}" ya existe y no se insertará.`);
        }
    }

    console.log('✅ Seed de líneas completado exitosamente.');

    
};
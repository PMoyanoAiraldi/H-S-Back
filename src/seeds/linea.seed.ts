import { Linea } from 'src/linea/linea.entity';
import { DataSource, getRepository } from 'typeorm';




export const seedLinea = async (dataSource: DataSource) => {
    const lineaRepository = dataSource.getRepository(Linea);

    const linea = [
    {
        codigo: 220,   
        nombre: 'BOMBAS A ENGRANAJES HS'
    },
    {
        codigo: 12,
        nombre: 'MANGUERAS HIDRAULICAS',
    },
    {
        codigo: 21,
        nombre: 'MOTOR ORBITAL M+S',
    },
    {
        codigo: 26, 
        nombre: 'VALVULAS',
    },
    {
        codigo: 11,
        nombre: 'CILINDROS HIDRAULICOS  Y  REPUESTOS',
    },
];

  // Insertar categorias si no existen
    for (const lineas of linea) {
        const existingLinea = await lineaRepository.findOne({
        where: { nombre: lineas.nombre },
        });

        if (!existingLinea) {
        await lineaRepository.save(linea);
        console.log(`La linea "${lineas.nombre}" no existe y se insertará.`);
        } else {
        console.log(`La linea "${lineas.nombre}" ya existe y no se insertará.`);
        }
    }
};
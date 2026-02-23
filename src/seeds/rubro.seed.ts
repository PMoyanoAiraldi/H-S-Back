
import { Rubro } from 'src/rubro/rubro.entity';
import { DataSource, getRepository } from 'typeorm';




export const seedRubro = async (dataSource: DataSource) => {
    const rubroRepository = dataSource.getRepository(Rubro);

    const rubro = [
    {
        codigo: 5,   
        nombre: 'PAUNY'
    },
    {
        codigo: 1,
        nombre: 'MOTORES ORBITALES STD',
    },
    {
        codigo: 2,
        nombre: 'VALVULAS VARIAS',
    },
    {
        codigo: 1, 
        nombre: 'ALTA PRESION (R1)',
    },
    {
        codigo: 11,
        nombre: 'CILINDROS STD',
    },
];

  // Insertar rubros si no existen
    for (const rubros of rubro) {
        const existingRubro = await rubroRepository.findOne({
        where: { codigo: rubros.codigo },
        });

        if (!existingRubro) {
        await rubroRepository.save(rubros);
        console.log(`El rubro "${rubros.nombre}" no existe y se insertará.`);
        } else {
        console.log(`El rubro "${rubros.nombre}" ya existe y no se insertará.`);
        }
    }
};
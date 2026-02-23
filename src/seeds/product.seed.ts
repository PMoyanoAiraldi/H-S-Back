import { Linea } from 'src/linea/linea.entity';
import { Marca } from 'src/marca/marca.entity';
import { Products } from 'src/product/product.entity';
import { Rubro } from 'src/rubro/rubro.entity';
import { DataSource, getRepository } from 'typeorm';


export const seedProduct = async (dataSource: DataSource) => {

    const productRepository = dataSource.getRepository(Products);
    const lineaRepository = dataSource.getRepository(Linea);
    const marcaRepository = dataSource.getRepository(Marca);
    const rubroRepository = dataSource.getRepository(Rubro)

    try {

    const bombas = await lineaRepository.findOne({ where: { codigo: 319 } });
    const motores = await lineaRepository.findOne({ where: { codigo: 21 } });
    const valvulas = await lineaRepository.findOne({ where: { codigo: 26 } });
    const mangueras = await lineaRepository.findOne({ where: { codigo: 12 } });
    const cilindros = await lineaRepository.findOne({ where: { codigo: 11 } });

    console.log({ bombas, motores, valvulas, mangueras, cilindros });
    if (!bombas || !motores || !valvulas || !mangueras || !cilindros) {
            throw new Error('❌ Alguna línea no existe. Revisá el seed de lineas.');
        }

        console.log('✅ Todas las lineas encontradas, creando productos...');
    
    const rexroth = await marcaRepository.findOne({ where: { codigo: 162}});
    const graselli = await marcaRepository.findOne({ where: { codigo: 140}});
    const verion = await marcaRepository.findOne({ where: { codigo: 71}});
    const metalurgicaCesca = await marcaRepository.findOne({ where: { codigo: 11}});
    const moroAlberto = await marcaRepository.findOne({ where: { codigo: 17}});

    if (!rexroth || !graselli || !verion || !metalurgicaCesca || !moroAlberto) {
            throw new Error('❌ Alguna marca no existe. Revisá el seed de marcas.');
        }

        console.log('✅ Todas las marcas encontradas, creando productos...');

    const pauny = await rubroRepository.findOne({ where: { codigo: 5}});
    const motoresOrbitales = await rubroRepository.findOne({ where: { codigo: 1}});
    const valvulasVarias = await rubroRepository.findOne({ where: { codigo: 2}});
    const altaPresion = await rubroRepository.findOne({ where: { codigo: 1}});
    const cilindrosStd = await rubroRepository.findOne({ where: { codigo: 11}});

    if (!pauny || !motoresOrbitales || !valvulasVarias || !altaPresion || !cilindrosStd) {
            throw new Error('❌ Algun rubro no existe. Revisá el seed de rubros.');
        }

        console.log('✅ Todos los rubros encontrados, creando productos...');    


    const products = [
    {
        nombre: 'BOMBA A PISTONES A10VO 45 DFR/52R-PUC64N00',
        descripcion:'Completar descripción',
        codigo: 16593,
        codigoAlternativo1: "910970025",
        codigoAlternativo2: "JM-RX-BP10",
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1764110129/bomba_pistones_rexroth_vg72sc.png',
        state: true,
        linea: bombas,
        marca: rexroth,
        rubro: pauny
    },
    {
        nombre: 'MOTOR ORBITAL SERIE R 250CC -AX2- EJE Z6 1"- 7/8NF',
        descripcion:'Completar descripción',
        codigo: 11872,
        codigoAlternativo1: "MLHR250G4",
        codigoAlternativo2: "MLHR250G4",
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140047/motor-hidraulico_dypniq.png',
        state: true,
        linea: motores,
        marca: verion,
        rubro:motoresOrbitales
    },
    {
        nombre: 'VALVULA ANTIRRETORNO 1/2 NPT',
        descripcion:'Completar descripción',
        codigo: 1714,
        codigoAlternativo1: "0238-150",
        codigoAlternativo2: "0238-150",
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140242/valvulas_hidraulicas_u9h3rz.png',
        state: true,
        linea: valvulas,
        marca: metalurgicaCesca,
        rubro: valvulasVarias
    },
    {
        nombre: 'MANGUERA R1 - 1/4',
        descripcion:'Completar descripción',
        codigo: 75,
        codigoAlternativo1: "MH1/4R1",
        codigoAlternativo2: "MH1/4R1",
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140428/mangueras-1_yvorlm.png',
        state: true,
        linea: mangueras,
        marca: graselli,
        rubro: altaPresion
    },
    {
        nombre: 'CILINDRO STD. C/REG. 2,5"',
        descripcion:'Completar descripción',
        codigo: 273,
        codigoAlternativo1: "20253",
        codigoAlternativo2: "20253",
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140654/cilindros-hidraulicos_ixwbrq.png',
        state: true,
        linea: cilindros,
        marca: moroAlberto,
        rubro: cilindrosStd
    },

];

  // Insertar productos si no existen
    for (const product of products) {
        const existingProduct = await productRepository.findOne({
        where: { codigo: product.codigo },
        });

        if (!existingProduct) {
        await productRepository.save(product);
        console.log(`El producto "${product.nombre}" no existe y se insertará.`);
        } else {
        console.log(`El producto "${product.nombre}" ya existe y no se insertará.`);
        }
    }

    console.log('✅ Seed de productos completado exitosamente.');
    } catch (error) {
    console.error('❌ Error al ejecutar el seed de productos:');
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    }
};
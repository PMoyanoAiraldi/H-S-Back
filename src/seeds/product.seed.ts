import { Linea } from 'src/linea/linea.entity';
import { Products } from 'src/product/product.entity';
import { DataSource, getRepository } from 'typeorm';


export const seedProduct = async (dataSource: DataSource) => {

    const productRepository = dataSource.getRepository(Products);
    const lineaRepository = dataSource.getRepository(Linea);

    try {

    const bombas = await lineaRepository.findOne({ where: { nombre: 'BOMBAS A ENGRANAJES HS' } });
    const motores = await lineaRepository.findOne({ where: { nombre: 'MOTOR ORBITAL M+S' } });
    const valvulas = await lineaRepository.findOne({ where: { nombre: 'VALVULAS' } });
    const mangueras = await lineaRepository.findOne({ where: { nombre: 'MANGUERAS HIDRAULICAS' } });
    const cilindros = await lineaRepository.findOne({ where: { nombre: 'CILINDROS HIDRAULICOS  Y  REPUESTOS' } });

    console.log({ bombas, motores, valvulas, mangueras, cilindros });
    if (!bombas || !motores || !valvulas || !mangueras || !cilindros) {
            throw new Error('❌ Alguna línea no existe. Revisá el seed de lineas.');
        }

        console.log('✅ Todas las lineas encontradas, creando productos...');

    const products = [
    {
        nombre: 'BOMBA A PISTONES A10VO 45 DFR/52R-PUC64N00',
        descripcion:'Completar descripción',
        codigo: 16593,
        codigoAlternativo1: "910970025",
        codigoAlternativo2: "JM-RX-BP10",
        marcaId: "",
        lineaId: "",
        rubroId:"",
        subrubroId: "",
        precioId: "",
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1764110129/bomba_pistones_rexroth_vg72sc.png',
        state: true,
        linea: bombas
    },
    {
        nombre: 'MOTOR ORBITAL SERIE R 250CC -AX2- EJE Z6 1"- 7/8NF',
        descripcion:'Completar descripción',
        codigo: 11872,
        codigoAlternativo1: "MLHR250G4",
        codigoAlternativo2: "MLHR250G4",
        marcaId: "",
        lineaId: "",
        rubroId:"",
        subrubroId: "",
        precioId: "",
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140047/motor-hidraulico_dypniq.png',
        state: true,
        linea: motores
    },
    {
        nombre: 'VALVULA ANTIRRETORNO 1/2 NPT',
        descripcion:'Completar descripción',
        codigo: 1714,
        codigoAlternativo1: "0238-150",
        codigoAlternativo2: "0238-150",
        marcaId: "",
        lineaId: "",
        rubroId:"",
        subrubroId: "",
        precioId: "",
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140242/valvulas_hidraulicas_u9h3rz.png',
        state: true,
        linea: valvulas
    },
    {
        nombre: 'MANGUERA R1 - 1/4',
        descripcion:'Completar descripción',
        codigo: 75,
        codigoAlternativo1: "MH1/4R1",
        codigoAlternativo2: "MH1/4R1",
        marcaId: "",
        lineaId: "",
        rubroId:"",
        subrubroId: "",
        precioId: "",
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140428/mangueras-1_yvorlm.png',
        state: true,
        linea: mangueras
    },
    {
        nombre: 'CILINDRO STD. C/REG. 2,5"',
        descripcion:'Completar descripción',
        codigo: 273,
        codigoAlternativo1: "20253",
        codigoAlternativo2: "20253",
        marcaId: "",
        lineaId: "",
        rubroId:"",
        subrubroId: "",
        precioId: "",
        imgUrl: 'https://res.cloudinary.com/dl7hjkrhq/image/upload/v1758140654/cilindros-hidraulicos_ixwbrq.png',
        state: true,
        linea: cilindros
    },

];

  // Insertar productos si no existen
    for (const product of products) {
        const existingProduct = await productRepository.findOne({
        where: { nombre: product.nombre },
        });

        if (!existingProduct) {
        await productRepository.save(product);
        console.log(`El producto "${product.nombre}" no existe y se insertará.`);
        } else {
        console.log(`El producto "${product.nombre}" ya existe y no se insertará.`);
        }
    }

    
    } catch (error) {
    console.error('❌ Error al ejecutar el seed de productos:');
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    }
};
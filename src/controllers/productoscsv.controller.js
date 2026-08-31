const Product = require('../models/product.model');
require('../models/category.model');
const {productosATexto, textoAProductos} = require('../services/productos');

const BOM = String.fromCharCode(0xfeff);

const exportarProductos = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name').sort({name: 1});

    const filas = products.map((product) => ({
      Id: product._id,
      Nombre: product.name,
      Categoria: product.category ? product.category.name : '',
      Descripcion: product.description,
      Precio: product.price.toFixed(2),
      Stock: product.stock
    }));

    const texto = productosATexto(filas);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="productos.csv"');
    return res.status(200).send(BOM + texto);
  } catch {
    return res.status(400).json({message: 'No se pudieron exportar los productos'});
  }
};

const importarProductos = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({message: 'Selecciona un fichero CSV'});
    }

    const filas = textoAProductos(req.file.buffer.toString('utf-8'));
    let actualizados = 0;

    for (const fila of filas) {
      const product = await Product.findByIdAndUpdate(fila.Id, {
        name: fila.Nombre,
        description: fila.Descripcion,
        price: Number(fila.Precio),
        stock: Number(fila.Stock)
      });

      if (product) actualizados++;
    }

    return res.status(200).json({message: 'Productos importados correctamente', actualizados});
  } catch {
    return res.status(400).json({message: 'No se pudieron importar los productos'});
  }
};

module.exports = {exportarProductos, importarProductos};

const Order = require('../models/order.model');
require('../models/user.model');
const {pedidosATexto, textoAPedidos} = require('../services/pedidos');

const BOM = String.fromCharCode(0xfeff);

const exportarPedidos = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'email').sort({createdAt: -1});

    const filas = orders.map((order) => ({
      Id: order._id,
      Fecha: order.createdAt.toISOString().slice(0, 10),
      Email: order.user ? order.user.email : '',
      Articulos: order.items.map((item) => `${item.name} x${item.quantity}`).join(' | '),
      Total: order.totalPrice.toFixed(2),
      Estado: order.status
    }));

    const texto = pedidosATexto(filas);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="pedidos.csv"');
    return res.status(200).send(BOM + texto);
  } catch {
    return res.status(400).json({message: 'No se pudieron exportar los pedidos'});
  }
};

const importarPedidos = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({message: 'Selecciona un fichero CSV'});
    }

    const filas = textoAPedidos(req.file.buffer.toString('utf-8'));
    let actualizados = 0;

    for (const fila of filas) {
      const order = await Order.findByIdAndUpdate(
        fila.Id,
        {status: fila.Estado},
        {runValidators: true}
      );

      if (order) actualizados++;
    }

    return res.status(200).json({message: 'Pedidos importados correctamente', actualizados});
  } catch {
    return res.status(400).json({message: 'No se pudieron importar los pedidos'});
  }
};

module.exports = {exportarPedidos, importarPedidos};

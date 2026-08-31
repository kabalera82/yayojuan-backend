const Order = require('../models/order.model');
const {crearPedido, actualizarPedido} = require('../services/pedidos');

const requestOrder = async (req, res) => {
  try {
    const resultado = await crearPedido(req.user, req.body.items);

    if (resultado.message) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch {
    return res.status(400).json({message: 'No se pudo solicitar el pedido'});
  }
};

const updateOrder = async (req, res) => {
  try {
    const resultado = await actualizarPedido(req.params.id, req.body.items);

    if (resultado.message) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch {
    return res.status(400).json({message: 'No se pudo actualizar el pedido'});
  }
};

const getMyOrders = async (req, res) => {
  try {
    const {sort} = req.query;

    let query = Order.find({user: req.user._id});

    if (sort === 'date_asc') query = query.sort({createdAt: 1});
    if (sort === 'date_desc') query = query.sort({createdAt: -1});
    if (sort === 'status_asc') query = query.sort({status: 1});
    if (sort === 'status_desc') query = query.sort({status: -1});

    const orders = await query;
    return res.status(200).json(orders);
  } catch {
    return res.status(400).json({message: 'No se pudieron obtener los pedidos'});
  }
};

const getOrders = async (req, res) => {
  try {
    const {sort} = req.query;

    let query = Order.find().populate('user', 'username email');

    if (sort === 'date_asc') query = query.sort({createdAt: 1});
    if (sort === 'date_desc') query = query.sort({createdAt: -1});
    if (sort === 'status_asc') query = query.sort({status: 1});
    if (sort === 'status_desc') query = query.sort({status: -1});

    const orders = await query;
    return res.status(200).json(orders);
  } catch {
    return res.status(400).json({message: 'No se pudieron obtener los pedidos'});
  }
};

const getOrderById = async (req, res) => {
  try {
    const {id} = req.params;
    const order = await Order.findById(id).populate('user', 'username email');

    if (!order) {
      return res.status(400).json({message: 'Pedido no encontrado'});
    }

    const isOwner = order.user._id.equals(req.user._id);
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(400).json({message: 'No tienes permisos para ver este pedido'});
    }

    return res.status(200).json(order);
  } catch {
    return res.status(400).json({message: 'No se pudo obtener el pedido'});
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const {id} = req.params;
    const {status} = req.body;

    const validStatuses = Order.schema.path('status').enumValues;
    if (!validStatuses.includes(status)) {
      return res.status(400).json({message: 'Estado no válido'});
    }

    const order = await Order.findByIdAndUpdate(id, {status}, {new: true, runValidators: true});

    if (!order) {
      return res.status(400).json({message: 'Pedido no encontrado'});
    }

    return res.status(200).json(order);
  } catch {
    return res.status(400).json({message: 'No se pudo actualizar el pedido'});
  }
};

module.exports = {requestOrder, updateOrder, getMyOrders, getOrders, getOrderById, updateOrderStatus};

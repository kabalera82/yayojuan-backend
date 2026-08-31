const {aTexto, aObjetos} = require('./csv');

const CABECERAS = ['Id', 'Nombre', 'Categoria', 'Descripcion', 'Precio', 'Stock'];

function productosATexto(productos) {
  return aTexto(CABECERAS, productos);
}

function textoAProductos(texto) {
  return aObjetos(texto, CABECERAS);
}

module.exports = {productosATexto, textoAProductos};

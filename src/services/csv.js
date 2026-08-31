function aTexto(cabeceras, objetos) {
  const lineas = objetos.map((objeto) => cabeceras.map((cabecera) => objeto[cabecera]).join(';'));

  return [cabeceras.join(';'), ...lineas].join('\n');
}

function aObjetos(texto, cabeceras) {
  const filas = texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');

  const objetos = [];

  for (const fila of filas.slice(1)) {
    const columnas = fila.split(';');

    const objeto = {};
    cabeceras.forEach((cabecera, i) => {
      objeto[cabecera] = columnas[i];
    });

    objetos.push(objeto);
  }

  return objetos;
}

module.exports = {aTexto, aObjetos};

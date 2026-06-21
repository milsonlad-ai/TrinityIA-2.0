class ConversorDeUnidades {
  async run(prompt) {
    const unidades = {
      'km': 1000,
      'm': 1,
      'cm': 0.01,
      'mm': 0.001
    };
    const [valor, de, para] = prompt.split(' ');
    const resultado = (parseFloat(valor) * unidades[de]) / unidades[para];
    return `${valor} ${de} é igual a ${resultado} ${para}`;
  }
}
module.exports = ConversorDeUnidades;
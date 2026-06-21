class GeradorDeSenhas {
  async run(prompt) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()_+~`|}{[]:;?><,./-=';
    const tamanho = parseInt(prompt) || 10;
    let senha = '';
    for (let i = 0; i < tamanho; i++) {
      senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return senha;
  }
}
module.exports = GeradorDeSenhas;
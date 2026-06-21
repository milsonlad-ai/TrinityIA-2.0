const fs = require("fs");
const path = require("path");

function gerarModulo(nome) {
    const codigo = `
class ${nome}Module {
    async run(prompt) {
        return "Modulo ${nome} executado para: " + prompt;
    }
}
module.exports = ${nome}Module;
`;
    const dir = path.join(__dirname, "../modules");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(path.join(dir, `${nome}.js`), codigo);
    console.log("Novo modulo criado:", nome);
    return nome;
}

module.exports = { gerarModulo };

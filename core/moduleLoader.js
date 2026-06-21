const fs = require("fs");
const path = require("path");

const modulesDir = path.join(__dirname, "../modules");
const cache = new Map();

async function moduloExiste(nome) {
    try {
        await fs.promises.access(path.join(modulesDir, nome + ".js"));
        return true;
    } catch {
        return false;
    }
}

function carregarModulo(nome) {
    try {
        const caminho = path.join(modulesDir, nome + ".js");
        if (cache.has(nome)) {
            delete require.cache[require.resolve(caminho)];
        }
        const modulo = require(caminho);
        cache.set(nome, modulo);
        return modulo;
    } catch (erro) {
        console.error(`Erro ao carregar modulo "${nome}":`, erro.message);
        return null;
    }
}

async function criarModulo(nome) {
    if (await moduloExiste(nome)) {
        console.warn(`Modulo "${nome}" ja existe`);
        return false;
    }
    const caminho = path.join(modulesDir, nome + ".js");
    const codigo = `
class ${nome}Module {
    async run(prompt) {
        return "Resultado do modulo ${nome} para: " + prompt;
    }
}
module.exports = ${nome}Module;
`;
    await fs.promises.writeFile(caminho, codigo, "utf8");
    console.log(`Modulo "${nome}" criado em ${caminho}`);
    return true;
}

async function executarModulo(nome, prompt) {
    const ModuloClass = carregarModulo(nome);
    if (!ModuloClass) return { status: "erro", resposta: null };
    const instancia = new ModuloClass();
    const resposta = await instancia.run(prompt);
    return { status: "ok", resposta };
}

module.exports = { moduloExiste, carregarModulo, criarModulo, executarModulo };

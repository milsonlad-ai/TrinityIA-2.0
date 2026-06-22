require('dotenv').config();
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { perguntarIA } = require("./aiClient");

const modulesDir = path.join(__dirname, "../modules");
const logFile = path.join(__dirname, "../evolution_log.json");

function log(entrada) {
    let logs = [];
    if (fs.existsSync(logFile)) {
        logs = JSON.parse(fs.readFileSync(logFile, "utf8") || "[]");
    }
    logs.push({ ...entrada, date: new Date().toISOString() });
    if (logs.length > 100) logs.shift();
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
}

function ultimoCommitSeguro() {
    try {
        return execSync("git rev-parse HEAD", { cwd: path.join(__dirname, "..") }).toString().trim();
    } catch {
        return null;
    }
}

function reverterPara(commit) {
    try {
        execSync(`git reset --hard ${commit}`, { cwd: path.join(__dirname, "..") });
        return true;
    } catch (e) {
        return false;
    }
}

function listarModulosExistentes() {
    if (!fs.existsSync(modulesDir)) return [];
    return fs.readdirSync(modulesDir)
        .filter(f => f.endsWith(".js"))
        .map(f => f.replace(".js", ""));
}

async function gerarNovoModulo() {
    const existentes = listarModulosExistentes();

    const prompt = `Voce e um gerador de modulos para um sistema Node.js chamado TrinityIA.
Modulos existentes: ${existentes.join(", ")}.
Crie UM novo modulo util e simples (utilidade real, ex: conversor, calculadora, validador, gerador de ideias, etc), DIFERENTE dos existentes.
Responda APENAS em JSON, sem explicacao, no formato exato:
{"nome": "nomeDoModulo", "codigo": "class NomeModule {\\n  async run(prompt) {\\n    return \\"resposta aqui\\";\\n  }\\n}\\nmodule.exports = NomeModule;"}
O campo "codigo" deve ser uma classe JS valida, exportada com module.exports, com um metodo async run(prompt).`;

    const resposta = await perguntarIA(prompt);

    try {
        const limpo = resposta.trim().replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "");
        const obj = JSON.parse(limpo);
        if (!obj.nome || !obj.codigo) throw new Error("formato invalido");
        return obj;
    } catch (e) {
        return null;
    }
}

async function evoluirComSeguranca() {
    console.log("===== CICLO DE AUTO-EVOLUCAO SEGURA =====");
    const commitSeguro = ultimoCommitSeguro();

    if (!commitSeguro) {
        console.log("Sem git inicializado, abortando ciclo.");
        log({ status: "abortado", motivo: "sem git" });
        return;
    }

    const sugestao = await gerarNovoModulo();
    if (!sugestao) {
        console.log("IA nao retornou um modulo valido. Nada feito.");
        log({ status: "sem_sugestao_valida" });
        return;
    }

    const nomeArquivo = sugestao.nome.replace(/[^a-zA-Z0-9_]/g, "");
    const caminho = path.join(modulesDir, nomeArquivo + ".js");

    if (fs.existsSync(caminho)) {
        console.log("Modulo ja existe, pulando este ciclo.");
        log({ status: "duplicado", modulo: nomeArquivo });
        return;
    }

    fs.writeFileSync(caminho, sugestao.codigo);
    console.log("Modulo gerado:", nomeArquivo);

    // TESTE 1: sintaxe
    try {
        execSync(`node --check "${caminho}"`);
    } catch (e) {
        console.log("Falhou no teste de sintaxe. Removendo modulo.");
        fs.unlinkSync(caminho);
        log({ status: "falha_sintaxe", modulo: nomeArquivo });
        return;
    }

    // TESTE 2: execucao real
    try {
        delete require.cache[require.resolve(caminho)];
        const ModuloClass = require(caminho);
        const instancia = new ModuloClass();
        const resultado = await instancia.run("teste de funcionamento");
        if (typeof resultado !== "string" || resultado.length === 0) {
            throw new Error("modulo nao retornou resposta valida");
        }
    } catch (e) {
        console.log("Falhou no teste de execucao. Removendo modulo.");
        fs.unlinkSync(caminho);
        log({ status: "falha_execucao", modulo: nomeArquivo, erro: e.message });
        return;
    }

    // Passou nos testes -> commit
    try {
        execSync(`git add modules/${nomeArquivo}.js evolution_log.json`, { cwd: path.join(__dirname, "..") });
        execSync(`git commit -m "Auto-evolucao: novo modulo ${nomeArquivo}"`, { cwd: path.join(__dirname, "..") });
        console.log("Modulo aprovado e commitado:", nomeArquivo);
        log({ status: "sucesso", modulo: nomeArquivo });
    } catch (e) {
        console.log("Falha ao commitar. Revertendo por seguranca.");
        reverterPara(commitSeguro);
        log({ status: "falha_commit", modulo: nomeArquivo });
    }
}

module.exports = { evoluirComSeguranca };

if (require.main === module) {
    evoluirComSeguranca().then(() => process.exit(0));
}

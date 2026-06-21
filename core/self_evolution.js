const { gerarModulo } = require("../generator/module_generator");
const { exec } = require("child_process");

function evoluir() {
    console.log("===== TRINITY AUTO EVOLUTION =====");

    console.log("1. Criando novo modulo...");
    gerarModulo("auto_module_" + Date.now());

    console.log("2. Publicando no GitHub...");
    exec("bash atualiza_trinity.sh", (err) => {
        if (err) {
            console.log("Erro ao publicar:", err.message);
            return;
        }
        console.log("Trinity publicada no GitHub");
    });
}

module.exports = { evoluir };

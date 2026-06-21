const readline = require("readline");
const TrinityIA = require("./main");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const trinity = new TrinityIA();

console.log("Trinity AI (modo terminal) iniciado");
console.log("Digite um prompt ou 'sair'");

function ask() {
  rl.question("Trinity > ", async (prompt) => {
    if (prompt === "sair") {
      console.log("Encerrando Trinity...");
      rl.close();
      return;
    }
    const result = await trinity.processAll(prompt);
    console.log(result);
    ask();
  });
}

ask();

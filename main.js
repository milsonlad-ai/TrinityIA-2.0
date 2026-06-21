const { saveMemory } = require('./data/memory');
const TrinityBrain = require('./core/brain');

class TrinityIA {
    async processAll(input) {
        console.log("\nTrinity esta a pensar...");
        const agents = await TrinityBrain(input);

        const result = {
            prompt: input,
            agents,
            timestamp: new Date().toISOString()
        };

        console.log("Trinity analisou:", JSON.stringify(result, null, 2));
        saveMemory(input, result);
        return result;
    }
}

module.exports = TrinityIA;

if (require.main === module) {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const trinity = new TrinityIA();

    console.log("Trinity AGI iniciada.");
    console.log("Digite uma mensagem ou 'sair' para encerrar.");

    function askUser() {
        rl.question('\nTrinityIA > ', async (input) => {
            if (input.toLowerCase() === 'sair') {
                console.log("Encerrando Trinity...");
                process.exit();
            }
            await trinity.processAll(input);
            askUser();
        });
    }
    askUser();
}

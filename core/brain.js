const Search = require("../modules/search/run");
const { perguntarIA } = require("./aiClient");

async function TrinityBrain(prompt) {
    const results = {};

    results.resposta_ia = await perguntarIA(prompt);
    results.search = await new Search().run(prompt);

    return results;
}

module.exports = TrinityBrain;

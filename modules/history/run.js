class HistoryModule {
  async run(prompt) {
    return `Contexto historico para: "${prompt}"`;
  }
}
module.exports = HistoryModule;

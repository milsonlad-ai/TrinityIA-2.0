const { smartSearch } = require('../../search/searchEngine');

class SearchModule {
  async run(prompt) {
    return await smartSearch(prompt);
  }
}
module.exports = SearchModule;

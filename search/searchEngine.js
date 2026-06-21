const axios = require('axios');
const { saveKnowledge, searchKnowledge } = require('../data/knowledge');

const client = axios.create({
    timeout: 8000,
    headers: { 'User-Agent': 'TrinityAI-Agent/2.1' }
});

async function buscarTituloWikipedia(query) {
    try {
        const res = await client.get('https://pt.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                list: 'search',
                srsearch: query,
                format: 'json',
                srlimit: 1
            }
        });
        const results = res.data?.query?.search;
        if (results && results.length > 0) {
            return results[0].title;
        }
        return null;
    } catch (e) {
        return null;
    }
}

async function smartSearch(query) {
    const cached = searchKnowledge(query);
    if (cached) {
        return "Conhecimento salvo: " + cached.content;
    }

    console.log(`Trinity buscando por: ${query}`);

    try {
        const titulo = await buscarTituloWikipedia(query);
        if (titulo) {
            const wiki = await client.get(
                `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titulo)}`
            );
            if (wiki.data && wiki.data.extract) {
                saveKnowledge(query, wiki.data.extract);
                return wiki.data.extract;
            }
        }
    } catch (e) { /* tenta proxima fonte */ }

    try {
        const ddg = await client.get(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`
        );
        if (ddg.data && ddg.data.AbstractText) {
            saveKnowledge(query, ddg.data.AbstractText);
            return ddg.data.AbstractText;
        }
        if (ddg.data && ddg.data.RelatedTopics && ddg.data.RelatedTopics.length > 0) {
            const topic = ddg.data.RelatedTopics.find(t => t.Text);
            if (topic) {
                saveKnowledge(query, topic.Text);
                return topic.Text;
            }
        }
    } catch (e) { /* sem rede ou erro */ }

    return "Nenhum resumo disponivel no momento.";
}

module.exports = { smartSearch };

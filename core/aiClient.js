require('dotenv').config();
const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function perguntarIA(prompt) {
    if (!GROQ_API_KEY) {
        return "Chave GROQ_API_KEY nao configurada no .env";
    }

    try {
        const res = await axios.post(
            GROQ_URL,
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Voce e a Trinity, uma IA assistente util, direta e em portugues." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 20000
            }
        );

        return res.data.choices[0].message.content;
    } catch (e) {
        const msg = e.response?.data?.error?.message || e.message;
        return "Erro ao consultar IA: " + msg;
    }
}

module.exports = { perguntarIA };

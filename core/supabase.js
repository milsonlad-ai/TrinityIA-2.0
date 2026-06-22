require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function salvarMemoria(prompt, resposta) {
    const { error } = await supabase
        .from('trinity_memory')
        .insert([{ prompt, resposta, data: new Date().toISOString() }]);
    if (error) console.log('Erro memoria:', error.message);
}

async function salvarModulo(nome, codigo) {
    const { error } = await supabase
        .from('trinity_modules')
        .insert([{ nome, codigo, data: new Date().toISOString() }]);
    if (error) console.log('Erro modulo:', error.message);
}

async function salvarConhecimento(topico, conteudo) {
    const { error } = await supabase
        .from('trinity_knowledge')
        .insert([{ topico, conteudo, data: new Date().toISOString() }]);
    if (error) console.log('Erro conhecimento:', error.message);
}

async function buscarMemoria(limite = 10) {
    const { data, error } = await supabase
        .from('trinity_memory')
        .select('*')
        .order('data', { ascending: false })
        .limit(limite);
    if (error) return [];
    return data;
}

module.exports = { salvarMemoria, salvarModulo, salvarConhecimento, buscarMemoria };

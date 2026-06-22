require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function salvarMemoria(prompt, resposta) {
    const { error } = await supabase
        .from('memoria')
        .insert([{ prompt, resposta, data: new Date().toISOString() }]);
    if (error) console.log('Erro ao salvar memoria:', error.message);
}

async function salvarModulo(nome, codigo) {
    const { error } = await supabase
        .from('modulos')
        .insert([{ nome, codigo, data: new Date().toISOString() }]);
    if (error) console.log('Erro ao salvar modulo:', error.message);
}

async function salvarConhecimento(topico, conteudo) {
    const { error } = await supabase
        .from('conhecimento')
        .insert([{ topico, conteudo, data: new Date().toISOString() }]);
    if (error) console.log('Erro ao salvar conhecimento:', error.message);
}

async function buscarMemoria(limite = 10) {
    const { data, error } = await supabase
        .from('memoria')
        .select('*')
        .order('data', { ascending: false })
        .limit(limite);
    if (error) return [];
    return data;
}

module.exports = { salvarMemoria, salvarModulo, salvarConhecimento, buscarMemoria };

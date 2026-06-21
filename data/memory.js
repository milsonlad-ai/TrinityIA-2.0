const fs = require('fs');
const path = require('path');
const memoryFile = path.join(__dirname, 'memory.json');

function saveMemory(prompt, response) {
    try {
        let data = [];
        if (fs.existsSync(memoryFile)) {
            const raw = fs.readFileSync(memoryFile, 'utf8');
            data = JSON.parse(raw || '[]');
        }
        data.push({ prompt, response, date: new Date().toISOString() });
        if (data.length > 200) data.shift();
        fs.writeFileSync(memoryFile, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        console.log("Falha ao salvar memoria:", e.message);
        return false;
    }
}

function getMemory() {
    if (!fs.existsSync(memoryFile)) return [];
    try {
        return JSON.parse(fs.readFileSync(memoryFile, 'utf8') || '[]');
    } catch {
        return [];
    }
}

module.exports = { saveMemory, getMemory };

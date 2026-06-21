const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'knowledge.json');

function saveKnowledge(topic, content) {
    try {
        let data = [];
        if (fs.existsSync(file)) {
            data = JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
        }
        data.push({ topic, content, date: new Date().toISOString() });
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        return true;
    } catch (e) {
        return false;
    }
}

function searchKnowledge(topic) {
    try {
        if (!fs.existsSync(file)) return null;
        const data = JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
        return data.find(item => item.topic.toLowerCase().includes(topic.toLowerCase())) || null;
    } catch (e) {
        return null;
    }
}

module.exports = { saveKnowledge, searchKnowledge };

const fs = require("fs");
const path = require("path");

class Planner {
    constructor() {
        this.goalsFile = path.join(__dirname, "../goals.json");
        if (!fs.existsSync(this.goalsFile)) {
            fs.writeFileSync(this.goalsFile, JSON.stringify([]));
        }
    }

    loadGoals() {
        return JSON.parse(fs.readFileSync(this.goalsFile, 'utf8') || '[]');
    }

    saveGoals(goals) {
        fs.writeFileSync(this.goalsFile, JSON.stringify(goals, null, 2));
    }

    generateGoals() {
        const goals = [
            "aprender inteligencia artificial",
            "estudar programacao",
            "melhorar modulos existentes",
            "pesquisar novas tecnologias"
        ];
        this.saveGoals(goals);
        return goals;
    }

    getNextGoal() {
        const goals = this.loadGoals();
        if (goals.length === 0) return null;
        return goals[Math.floor(Math.random() * goals.length)];
    }
}

module.exports = new Planner();

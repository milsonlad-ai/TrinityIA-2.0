# TrinityIA-2.0

Sistema de IA modular em Node.js.

## Como usar

Instalar dependencias:
    npm install

Modo conversa simples:
    npm start

Modo terminal multi-agente:
    npm run terminal

Painel web (porta 3000):
    npm run web

## Estrutura
- main.js            -> ponto de entrada principal (classe TrinityIA)
- terminal.js         -> interface de terminal alternativa
- core/brain.js        -> combina respostas de todos os modulos
- core/memory.js       -> salva e le memoria local (data/memory.json)
- core/planner.js      -> gera e escolhe objetivos (goals.json)
- core/moduleLoader.js -> carrega, cria e executa modulos dinamicamente
- modules/*/run.js     -> modulos especializados (programming, creative, business, multimedia, search, history)
- generator/module_generator.js -> cria novos modulos sob comando (nao roda sozinho)
- data/                -> arquivos de memoria e conhecimento (JSON)

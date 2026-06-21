#!/bin/bash
echo "==============================="
echo "INICIANDO ATUALIZACAO TRINITY"
echo "Data: $(date)"
echo "==============================="

git status
git add .
git commit -m "Atualizacao automatica da Trinity IA" || echo "Nada para commitar"
git push || echo "Push nao necessario"

echo "==============================="
echo "FINALIZADO"
echo "==============================="

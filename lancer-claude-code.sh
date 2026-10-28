#!/bin/bash
# Lance Claude Code dans le dossier du site Le Bar à Cuq.
# Usage (macOS / Linux) : ouvrir un Terminal dans ce dossier, puis :
#   chmod +x lancer-claude-code.sh
#   ./lancer-claude-code.sh

cd "$(dirname "$0")" || exit 1

# 1. Node.js est nécessaire pour installer Claude Code
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js n'est pas installé."
  echo "Téléchargez-le sur https://nodejs.org (version LTS), installez-le, puis relancez ce script."
  exit 1
fi

# 2. Installation de Claude Code si besoin
if ! command -v claude >/dev/null 2>&1; then
  echo "Installation de Claude Code..."
  npm install -g @anthropic-ai/claude-code || {
    echo "L'installation a échoué. Vérifiez votre connexion et relancez le script."
    exit 1
  }
fi

# 3. Lancement dans le dossier du site
echo "Ouverture de Claude Code dans le dossier du site..."
claude

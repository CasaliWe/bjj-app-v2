# bash ./upload-dist-to-vps.sh


#!/usr/bin/env bash
# Script simples para enviar a pasta dist para uma VPS Ubuntu 24 via SSH (com senha) e ajustar permissões.
# Preencha as variáveis abaixo e execute: ./upload-dist-to-vps.sh

set -euo pipefail
IFS=$'\n\t'

########################################
# CONFIGURAÇÕES (edite aqui)
########################################
SERVER_HOST=""   # Ex.: 203.0.113.10
SERVER_PORT=22                     # Porta SSH, geralmente 22
SERVER_USER="root"                # Usuário SSH (você disse que usará root)
SERVER_PASSWORD=""  # Senha do usuário SSH

# Caminho remoto para onde os arquivos da dist serão enviados
REMOTE_PATH="/home/bjjacademy/htdocs/bjjacademy.com.br"    # Ex.: /var/www/meu-app

# Pasta local que será enviada (build da sua aplicação)
LOCAL_DIST_DIR="./dist"

# Dono/Grupo desejados dos arquivos no servidor (ajuste conforme seu stack)
PERMISSIONS_OWNER="root:root"     # Ex.: www-data:www-data

########################################
# NÃO EDITE ABAIXO SE NÃO SOUBER O QUE ESTÁ FAZENDO
########################################

# Cores simples para feedback
COLOR_RESET='\033[0m'
COLOR_INFO='\033[1;34m'
COLOR_OK='\033[1;32m'
COLOR_WARN='\033[1;33m'
COLOR_ERR='\033[1;31m'

info()  { echo -e "${COLOR_INFO}[INFO]${COLOR_RESET} $*"; }
ok()    { echo -e "${COLOR_OK}[OK]${COLOR_RESET} $*"; }
warn()  { echo -e "${COLOR_WARN}[WARN]${COLOR_RESET} $*"; }
error() { echo -e "${COLOR_ERR}[ERRO]${COLOR_RESET} $*"; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    error "Comando obrigatório não encontrado: $1"
    exit 1
  fi
}

# Verificações básicas
require_cmd ssh
require_cmd tar
# scp não é obrigatório pois usaremos tar+ssh (funciona melhor e copia inclusive arquivos ocultos)

if [[ ! -d "$LOCAL_DIST_DIR" ]]; then
  error "Pasta local '$LOCAL_DIST_DIR' não encontrada. Gere o build antes (ex.: 'npm run build')."
  exit 1
fi

if [[ -z "${SERVER_HOST}" || -z "${SERVER_USER}" || -z "${SERVER_PASSWORD}" || -z "${REMOTE_PATH}" ]]; then
  error "Preencha SERVER_HOST, SERVER_USER, SERVER_PASSWORD e REMOTE_PATH no topo do script."
  exit 1
fi

# Detecta sshpass para login não interativo com senha
HAS_SSHPASS=false
if command -v sshpass >/dev/null 2>&1; then
  HAS_SSHPASS=true
fi

SSH_BASE_OPTS=(-o StrictHostKeyChecking=no -p "$SERVER_PORT")

if [[ "$HAS_SSHPASS" == true ]]; then
  info "Usando sshpass para autenticação com senha (não interativa)."
  SSH_CMD=(sshpass -p "$SERVER_PASSWORD" ssh "${SSH_BASE_OPTS[@]}" "$SERVER_USER@$SERVER_HOST")
  # Para o tar via ssh precisamos invocar o ssh diretamente, então montamos prefixo
  SSHPASS_PREFIX=(sshpass -p "$SERVER_PASSWORD")
else
  warn "sshpass não encontrado. A conexão pedirá a senha interativamente."
  warn "Opcional: instale sshpass para login automático."
  SSH_CMD=(ssh "${SSH_BASE_OPTS[@]}" "$SERVER_USER@$SERVER_HOST")
  SSHPASS_PREFIX=()
fi

info "Criando pasta remota: $REMOTE_PATH"
if ! "${SSH_CMD[@]}" "mkdir -p '$REMOTE_PATH'"; then
  error "Falha ao criar a pasta remota '$REMOTE_PATH'"
  exit 1
fi
ok "Pasta remota garantida."

info "Enviando conteúdo de '$LOCAL_DIST_DIR' para '$SERVER_USER@$SERVER_HOST:$REMOTE_PATH' (pode levar alguns instantes)"
# Envia via tar (copia inclusive arquivos ocultos e preserva estrutura)
# -C muda para o diretório da dist, -cf - cria tar em stdout, que é extraído no destino com -xf -
if ! tar -C "$LOCAL_DIST_DIR" -cf - . | "${SSHPASS_PREFIX[@]}" ssh "${SSH_BASE_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" "tar -C '$REMOTE_PATH' -xf -"; then
  error "Falha ao transferir arquivos via tar/ssh."
  exit 1
fi
ok "Arquivos enviados com sucesso."

info "Ajustando permissões no servidor (owner: $PERMISSIONS_OWNER, dirs: 755, arquivos: 644)"
PERM_CMDS=$(cat <<'EOF'
set -e
chown -R ${PERMISSIONS_OWNER} '${REMOTE_PATH}'
find '${REMOTE_PATH}' -type d -exec chmod 755 {} +
find '${REMOTE_PATH}' -type f -exec chmod 644 {} +
EOF
)
# Expande variáveis dentro do here-doc manualmente
PERM_CMDS=${PERM_CMDS//'${REMOTE_PATH}'/$REMOTE_PATH}
PERM_CMDS=${PERM_CMDS//'${PERMISSIONS_OWNER}'/$PERMISSIONS_OWNER}

if ! "${SSH_CMD[@]}" "$PERM_CMDS"; then
  error "Falha ao ajustar permissões em '$REMOTE_PATH'"
  exit 1
fi
ok "Permissões ajustadas."

ok "Concluído! Pasta '$LOCAL_DIST_DIR' enviada para '$SERVER_USER@$SERVER_HOST:$REMOTE_PATH' com sucesso."

# Dicas finais
if [[ "$HAS_SSHPASS" == false ]]; then
  echo
  warn "Dica: para evitar digitar a senha a cada execução, instale o sshpass (no seu ambiente bash)."
fi

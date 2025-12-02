#!/bin/sh
set -e

TOOLBOX_DB_PORT=6000
PORT=8080

export GOOGLE_GENAI_USE_VERTEXAI=FALSE
export TOOLBOX_DB_URL="http://127.0.0.1:${TOOLBOX_DB_PORT}"

echo "Starting Toolbox Servers..."
./toolbox --tools-file "market_analyst_agent/tools/tools.yaml" --port "${TOOLBOX_DB_PORT}" &

echo "Iniciando Agente ADK en el puerto externo $PORT..."
echo "El agente se conectará al Toolbox en ${TOOLBOX_DB_URL}"
uvicorn main:app --host 0.0.0.0 --port "${PORT}"

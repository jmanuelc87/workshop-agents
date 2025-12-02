FROM python:3.10-slim as builder
RUN pip install poetry
WORKDIR /app
COPY poetry.lock pyproject.toml ./
RUN poetry config virtualenvs.in-project true
RUN poetry install --no-root --no-interaction --no-ansi
# Use a slim Python base image for a smaller final container
FROM python:3.10-slim
WORKDIR /app
COPY --from=builder /app/.venv/ .venv/
ENV PATH="/app/.venv/bin:$PATH"
# Install toolbox and its dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
ENV TOOLBOX_VERSION=0.21.0
RUN curl -fSL "https://storage.googleapis.com/genai-toolbox/v${TOOLBOX_VERSION}/linux/amd64/toolbox" -o toolbox
RUN chmod +x toolbox
# Install npx
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt install -y nodejs
# Copy the application code
COPY ./agents/creative_director_agent/ ./creative_director_agent/
COPY ./agents/head_barista_agent/ ./head_barista_agent/
COPY ./agents/market_analyst_agent/ ./market_analyst_agent/
COPY ./agents/orchestrator_agent/ ./orchestrator_agent/
COPY ./agents/images/ ./images/
COPY ./main.py .
# Copy and make the startup script executable
COPY start.sh .
RUN chmod +x start.sh
# Use the script to start both the toolbox and the agent
CMD ["./start.sh"]

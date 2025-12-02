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
# Copy the application code
EXPOSE $PORT
COPY ./src/ui_main.py .
CMD ["python3", "ui_main.py"]

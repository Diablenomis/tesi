# docker/backend/Dockerfile

FROM python:3.8-slim

# Evita file .pyc e forza il flush dello stdout/stderr (utile nei container)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Directory di lavoro principale dell'app backend
WORKDIR /app/backend

# Copio solo i requirements per sfruttare la cache Docker
COPY ./gym-be-app/requirements.txt .

# Installo pip aggiornato e le dipendenze (incluso gunicorn)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt gunicorn

# Copio il codice dell'applicazione
COPY ./gym-be-app/app /app/backend

# Copio gli script di supporto (entrypoint, ecc.)
COPY ./docker /app/docker

# (Opzionale ma consigliato) Utente non-root per esecuzione più sicura
# RUN useradd -m appuser && chown -R appuser /app
# USER appuser

# La CMD/ENTRYPOINT la gestisci da docker-compose tramite entrypoint.sh

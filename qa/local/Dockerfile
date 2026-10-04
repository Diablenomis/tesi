FROM python:3.8-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY qa/local/requirements.docker.txt /tmp/qa-requirements.txt
RUN pip install --no-cache-dir -r /tmp/qa-requirements.txt
WORKDIR /workspace

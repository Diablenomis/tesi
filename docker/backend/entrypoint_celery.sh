#!/bin/sh
cd /app/backend

celery -A gym worker --loglevel=INFO

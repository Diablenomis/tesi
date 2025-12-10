#!/bin/sh
cd /app/backend

celery -A gym beat --loglevel=info --scheduler django_celery_beat.schedulers:DatabaseScheduler
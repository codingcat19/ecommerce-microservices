FROM python:3-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS development
WORKDIR /app
COPY . .
EXPOSE 5000
ENV FLASK_APP=app.python
ENV FLASK_ENV=development
CMD [ "flask", "run", "--host=0.0.0.0", "--port=5000", "--reload" ]

FROM base AS production
WORKDIR /app
COPY . .
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 5000
CMD [ "gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app" ]
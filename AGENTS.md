# Diet Tracker — Agent Guide

## Overview

Diet Tracker is a cyberpunk-themed Vue 3 + Vite SPA that tracks daily meals, water intake, and exercises. It is served via Nginx as a single Docker container.

## Image Tag

| Component | Docker Image |
|-----------|-------------|
| App | `arturoalvarez/diet-tracker:latest` |

## Local Build & Push

### Prerequisites

- Docker (with buildx for multi-arch)
- Logged into Docker Hub (`docker login`)

### Build and Push

```bash
docker build -t arturoalvarez/diet-tracker:latest .
docker push arturoalvarez/diet-tracker:latest
```

### Multi-Arch (ARM64 + AMD64)

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t arturoalvarez/diet-tracker:latest . --push
```

### Run Locally

```bash
docker run -d -p 8080:80 arturoalvarez/diet-tracker:latest
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automates:

1. **Build** — Builds the Docker image.
2. **Push** — Pushes the image to Docker Hub using `DOCKER_USERNAME` and `DOCKER_TOKEN` secrets.
3. **Trigger** — Runs on every push to `master` branch, or can be triggered manually.

### Secrets Required

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Docker Hub username (`arturoalvarez`) |
| `DOCKER_TOKEN` | Docker Hub access token (or password) |

## Local Development

```bash
npm install
npm run dev
```

# Docker Demo — Node.js + MongoDB API

Demo project for the **"Docker in 10 Minutes"** YouTube tutorial.
A simple Todos REST API built with Express.js and MongoDB, fully containerized.

<div align="center">
<h3>Docker in 10 Minutes – Complete Beginner's Guide</h3>
<a href="https://youtu.be/ZyWBs0CU2wk">
<img src="https://img.youtube.com/vi/ZyWBs0CU2wk/hqdefault.jpg" alt="Watch the Docker Tutorial" style="width:100%; max-width:600px;">
</a>
<p><i>Click the image to watch the full tutorial on YouTube</i></p>
</div>

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed
- That's it! No Node.js or MongoDB needed locally.

---

## Quick Start (Docker Compose)

```bash
# Clone or download this project, then:
cd demo

# Start the entire stack (app + MongoDB) in the background
docker compose up -d

# Verify both services are running
docker compose ps
```

App is now live at **http://localhost:3000**

---

## API Endpoints

| Method | URL | Description | Body |
|--------|-----|-------------|------|
| `GET` | `/` | Health check | — |
| `GET` | `/todos` | List all todos | — |
| `POST` | `/todos` | Create a todo | `{ "title": "..." }` |
| `DELETE` | `/todos/:id` | Delete a todo | — |

---

## Test the API

```bash
# Health check
curl http://localhost:3000

# Create a todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker"}'

# Create another
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Build something cool"}'

# List all todos
curl http://localhost:3000/todos

# Delete a todo (use the _id from the list above)
curl -X DELETE http://localhost:3000/todos/<_id>
```

---

## Useful Docker Commands

```bash
# View live logs from the app
docker compose logs -f app

# View logs from MongoDB
docker compose logs -f db

# Open a shell inside the running app container
docker exec -it docker-demo-app sh

# Open MongoDB shell inside the db container
docker exec -it docker-demo-db mongosh

# Stop and remove all containers (data is preserved in the volume)
docker compose down

# Stop AND delete all data (volume too)
docker compose down -v

# Rebuild image after code changes
docker compose up -d --build
```

---

## Project Structure

```
demo/
├── app.js              # Express app with routes
├── package.json        # Node.js dependencies
├── Dockerfile          # Instructions to build the app image
├── docker-compose.yml  # Multi-container app definition
├── .dockerignore       # Files to exclude from the Docker image
└── README.md           # This file
```

---

## How Docker Compose Works Here

```
┌─────────────────────────────────────────────┐
│              Docker Network                 │
│                                             │
│   ┌──────────────┐    ┌──────────────────┐  │
│   │  app:3000    │───▶│  db:27017        │  │
│   │ (Node.js)    │    │ (MongoDB 7)      │  │
│   └──────┬───────┘    └────────┬─────────┘  │
│          │                     │            │
└──────────┼─────────────────────┼────────────┘
           │                     │
     localhost:3000         db-data volume
     (your browser)        (persists data)
```

The `app` container reaches MongoDB via the hostname `db` — Docker's internal DNS resolves it automatically within the compose network.

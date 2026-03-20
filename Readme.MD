# Taskify

A full-stack task management app built with **Meteor**, **Blaze**, and **React**.

- ✅ Create and manage tasks
- ✅ Group tasks into projects
- ✅ Assign tasks to projects
- ✅ User authentication (login / signup)
- ✅ Each user sees only their own data
- ✅ Dockerized for deployment
- ✅ Deployed on Render with MongoDB Atlas

---

## Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Framework  | Meteor 3.x              |
| Frontend   | Blaze + React           |
| Database   | MongoDB                 |
| Styling    | Plain CSS (design system)|
| Auth       | Meteor Accounts         |
| Container  | Docker + Docker Compose |
| Deployment | Render                  |
| DB (prod)  | MongoDB Atlas           |

---

## Prerequisites

Make sure you have these installed before starting:

- [Meteor](https://docs.meteor.com/install.html)
- [Node.js](https://nodejs.org/) v18+
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

Check versions:
```bash
meteor --version
node --version
docker --version
docker-compose --version
git --version
```

---

## Project Structure

```
taskify/
├── client/
│   ├── main.js           # client entry point
│   └── main.css          # global styles
├── server/
│   └── main.js           # server entry point + seed data
├── imports/
│   ├── api/
│   │   ├── tasksMethods.js
│   │   ├── tasksPublications.js
│   │   ├── projectsMethods.js
│   │   └── projectsPublications.js
│   ├── db/
│   │   ├── TasksCollection.js
│   │   └── ProjectsCollection.js
│   └── ui/
│       ├── App.html
│       ├── App.js
│       ├── login/
│       │   ├── Login.html
│       │   └── Login.js
│       └── react/
│           ├── GroupTasks.jsx
│           └── components/
│               ├── TaskList.jsx
│               ├── Task.jsx
│               ├── Projects.jsx
│               ├── AssignProject.jsx
│               ├── Modal.jsx
│               └── UserMenu.jsx
├── Dockerfile
├── docker-compose.yml
├── deploy.sh
└── .gitignore
```

---

## Getting Started

### Option A Run locally with Meteor (development)

```bash
# 1. Clone the repo
git clone https://github.com/bisht-xp/meteor-todo-app
cd taskify

# 2. Install dependencies
meteor npm install

# 3. Start the app
meteor run

# 4. Open in browser
# http://localhost:3000
```

Default login:
- **Username:** `meteorite`
- **Password:** `password`

---

### Option B Run with Docker (production-like)

This runs the app exactly like it runs on Render.

#### Step 1 — Build the Meteor bundle

Meteor cannot run inside Docker so you build it locally first:

```bash
# Build the production bundle (takes 3-5 minutes)
meteor build ../build --architecture os.linux.x86_64 --server-only

# Copy bundle into project root
cp ../build/taskify.tar.gz ./bundle.tar.gz
```

This converts your Meteor app into a plain Node.js bundle that Docker can run.

#### Step 2 — Start with Docker Compose

```bash
# Build image and start both app + MongoDB
docker-compose up --build
```

#### Step 3 — Open in browser

```
http://localhost:3000
```

---

## Docker Commands Reference

```bash
# Start in foreground (see logs in terminal)
docker-compose up --build

# Start in background
docker-compose up --build -d

# View live logs
docker-compose logs -f app

# View MongoDB logs
docker-compose logs -f mongo

# Stop containers
docker-compose down

# Stop and delete all data (fresh start)
docker-compose down -v

# Check running containers
docker ps

# Rebuild after code changes
meteor build ../build --architecture os.linux.x86_64 --server-only
cp ../build/taskify.tar.gz ./bundle.tar.gz
docker-compose up --build
```

---

## How Docker Works in This Project

```
Your Machine                Docker
────────────                ──────
meteor build
     ↓
bundle.tar.gz   →   Dockerfile extracts it
                    npm install (production)
                    node main.js starts app
                         ↕
                    MongoDB container
                    (connected via Docker network)
```

The app and MongoDB talk to each other using Docker's internal network.
The app connects to MongoDB via `mongodb://mongo:27017/todos` where `mongo`
is the service name in `docker-compose.yml`.

---

## Environment Variables

| Variable    | Local (Docker)                    | Production (Render)               |
|-------------|-----------------------------------|-----------------------------------|
| `MONGO_URL` | `mongodb://mongo:27017/todos`     | MongoDB Atlas connection string   |
| `ROOT_URL`  | `http://localhost:3000`           | `https://meteor-todo-app.onrender.com/`   |
| `PORT`      | `3000`                            | `3000`                            |

For local Docker these are set in `docker-compose.yml`.
For production these are set in the Render dashboard.

---

## Deploying to Render

### First time setup

1. Push your code to GitHub (see section below)
2. Go to [render.com](https://render.com) and sign in with GitHub
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Set these values:

   | Field            | Value          |
   |------------------|----------------|
   | Runtime          | `Docker`       |
   | Dockerfile Path  | `./Dockerfile` |
   | Instance Type    | `Free`         |

6. Add environment variables in the Render dashboard:

   | Key         | Value                                                    |
   |-------------|----------------------------------------------------------|
   | `MONGO_URL` | `mongodb+srv://user:pass@cluster.mongodb.net/taskify`    |
   | `ROOT_URL`  | `https://your-app-name.onrender.com`                     |
   | `PORT`      | `3000`                                                   |

7. Click **Create Web Service**

### MongoDB Atlas setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0 cluster**
3. Go to **Database Access** → create a user with a password
4. Go to **Network Access** → add `0.0.0.0/0` to allow all IPs
5. Click **Connect** → **Drivers** → copy the connection string
6. Replace `<password>` with your actual password
7. Paste it as `MONGO_URL` in Render dashboard

---

## Deploying updates

Every time you make code changes run this one command:

```bash
./deploy.sh "describe your changes here"
```

This script does everything automatically:

```
1. meteor build     → compiles latest code into bundle
2. cp bundle        → updates bundle.tar.gz in project
3. git add .        → stages all changes
4. git commit       → commits with your message
5. git push         → pushes to GitHub
                         ↓
                    Render detects new push
                    pulls repo + rebuilds Docker image
                    deploys updated app automatically ✅
```

Example:
```bash
./deploy.sh "feat: add task filtering"
./deploy.sh "fix: login error message"
./deploy.sh "style: update card layout"
```

---

## Default Credentials

A seed user is created automatically on first run:

| Username    | Password   |
|-------------|------------|
| `meteorite` | `password` |

You can also create your own account using the signup form.

---

## Features

### Tasks
- Add tasks from the main task list
- Mark tasks as complete with checkbox
- Delete tasks
- Hide/show completed tasks
- Assign tasks to a project

### Projects
- Create projects
- Add tasks directly inside a project
- Delete a project (removes all its tasks)
- Tasks assigned from the main list move into the project

### Auth
- Login with username and password
- Create a new account via signup form
- Each user sees only their own tasks and projects
- Logout from the user menu in the header
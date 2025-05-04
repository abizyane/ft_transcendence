# AstroPong - The Mighty Pong Contest!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Optional: Add a license if you have one -->

Welcome to **AstroPong**, a 42 school project focused on creating a feature-rich website for playing the classic game of Pong, complete with real-time multiplayer, tournaments, user management, chat, and more.

## Table of Contents

1.  [Overview](#overview)
2.  [Key Features](#key-features)
3.  [Tech Stack](#tech-stack)
4.  [Project Structure](#project-structure)
5.  [Setup and Installation](#setup-and-installation)
6.  [Usage](#usage)
7.  [Implemented Features (Based on Subject Modules)](#implemented-features-based-on-subject-modules)
8.  [Security Considerations](#security-considerations)
9.  [Makefile Commands](#makefile-commands)

## Overview

**AstroPong** aims to deliver a modern web application where users can engage in Pong matches, participate in tournaments, interact with friends, and track their progress. The project emphasizes real-time capabilities, a robust user system, and adherence to security best practices, all within a containerized environment.

This implementation utilizes a Single-Page Application (SPA) architecture with a distinct frontend and backend, communicating via APIs and WebSockets.

## Key Features

*   **Real-time Pong Gameplay:** Play Pong against others.
*   **Tournament System:**
    *   Create and join multi-player tournaments.
    *   Tournament matchmaking and progression.
    *   Unique aliases for tournament participation.
*   **User Management & Authentication:**
    *   Secure user registration and login.
    *   JWT-based authentication with refresh tokens.
    *   Google OAuth integration for remote sign-in.
    *   Two-Factor Authentication (2FA) support (via OTP).
    *   User profiles with customizable avatars and details.
    *   Password change functionality.
*   **Social Features:**
    *   Friend request system (add, accept, reject, remove).
    *   View online status of friends.
    *   Block/Unblock users.
    *   Invite friends to games.
*   **Live Chat:**
    *   Direct messaging between users.
    *   Real-time typing indicators.
    *   Conversation history.
*   **Stats & History:**
    *   User statistics dashboard (wins, losses, XP, level).
    *   Detailed match history per user.
    *   Tournament history.
    *   Player ranking leaderboard.
    *   Weekly performance charts (win/loss, XP gain).
*   **Notifications:** Real-time notifications for friend requests, game invites, messages, etc.
*   **Game Customization:** Options to change paddle and ball colors (persisted per user).
*   **Dockerized Deployment:** Fully containerized application stack managed via Docker Compose.
*   **Secure:** HTTPS enforced, password hashing, protection against common web vulnerabilities (input validation).
*   **Logging Infrastructure:** Centralized logging using the ELK stack.

## Tech Stack

This project leverages the following technologies:

*   **Frontend:**
    *   Framework/Library: **Next.js (React)**
    *   Language: **TypeScript**
    *   Styling: **Tailwind CSS**, **CSS Modules**
    *   State Management: React Context API
    *   Real-time: WebSockets (via Django Channels connection)
    *   Charting: Chart.js
*   **Backend:**
    *   Framework: **Django**
    *   Language: **Python**
    *   API: **Django REST Framework (DRF)**
    *   Real-time: **Django Channels** (WebSockets)
    *   Authentication: **DRF Simple JWT** (JWT), Custom OAuth Logic, PyOTP (for 2FA)
*   **Database:** **PostgreSQL**
*   **Web Server / Reverse Proxy:** **Nginx** (Handles HTTPS termination, serves static files, proxies requests)
*   **Caching / Message Broker:** **Redis** (Used by Django Channels)
*   **Containerization:** **Docker**, **Docker Compose**
*   **Logging:** **ELK Stack** (Elasticsearch, Logstash, Kibana) + **Filebeat**
*   **Development Tools:** Make

## Project Structure

```
ft_transcendence/ # Root folder (may still reflect original project name)
├── docker-compose.yml       # Defines all services (frontend, backend, db, nginx, elk...)
├── Makefile                 # Utility commands for building, running, cleaning
├── backend/                 # Django Backend Application
│   ├── Dockerfile           # Backend Docker build instructions
│   ├── app/                 # Django project source code
│   │   ├── astropong/       # Core app (auth, users, friends, dashboard) - Named after the project!
│   │   ├── base/            # Django project settings, ASGI/WSGI config
│   │   ├── chat/            # Chat application (models, views, consumers)
│   │   ├── game/            # Game logic, models, consumers (including Tournament)
│   │   ├── notification/    # Notification system (models, consumers)
│   │   └── pictures/        # Media storage (likely mounted volume)
│   └── scripts/entrypoint.sh # Backend container startup script
├── frontend/                # Next.js Frontend Application
│   ├── Dockerfile           # Frontend Docker build instructions
│   ├── app/                 # Next.js project source code (using App Router)
│   │   ├── public/          # Static assets (fonts, images)
│   │   └── src/             # Main source code
│   │       ├── app/         # Next.js App Router pages and layouts
│   │       ├── components/  # Reusable React components
│   │       ├── services/    # API calls, context providers, socket logic
│   │       └── utils/       # Utility functions
│   └── ...                  # Config files (next.config, tailwind, tsconfig...)
├── infrastructure/          # Configuration for infrastructure components
│   ├── database/            # PostgreSQL setup
│   ├── elk_setup/           # ELK stack certificate/password setup
│   ├── filebeat/            # Filebeat configuration (log shipper)
│   ├── logstash/            # Logstash configuration (log processor)
│   └── nginx/               # Nginx configuration and Dockerfile
└── .env                     # Local environment variables (GITIGNORED!)
```

## Setup and Installation

**Prerequisites:**

*   Docker ([Install Docker](https://docs.docker.com/engine/install/))
*   Docker Compose ([Install Docker Compose](https://docs.docker.com/compose/install/))
*   Make
*   Git

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone github.com/abizyane/ft_transcendence
    cd ft_transcendence # Navigate into the cloned directory
    ```

2.  **Create Environment File:**
    Copy the example environment file and fill in your specific credentials and settings.
    ```bash
    # cp infrastructure/env_exemple .env
    nano .env # Edit the file with your values
    ```
    *Crucial variables likely include `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `ELASTIC_PASSWORD`, `KIBANA_PASSWORD`, potentially OAuth keys, JWT secret key (`SECRET_KEY` in Django settings might be used).*

3.  **Build and Run:**
    Use the Makefile to build the Docker images and start the services in detached mode.
    ```bash
    make
    ```
    Alternatively, use `make build` and then `make up`.

4.  **Access the Application:**
    Once all services are up and running (check with `make state` or `docker compose ps`), access the website via HTTPS at:
    [https://localhost:1443](https://localhost:1443)

    *Note: You might get a browser warning about a self-signed certificate. You'll need to accept the risk to proceed.*

5.  **Access Kibana (for logs):**
    Kibana can be accessed through the Nginx proxy (check `nginx.conf` for the exact path, often `/kibana`) or directly if exposed. Credentials will be `elastic` and the `ELASTIC_PASSWORD` set in your `.env`.

## Usage

1.  **Register/Login:** Create an account using the registration form or log in via email/password or Google OAuth.
2.  **Set up 2FA (Optional):** If enabled, scan the QR code with an authenticator app and enter the OTP.
3.  **Dashboard:** View your stats, recent match history, and level progression.
4.  **Play Pong:**
    *   Navigate to the Game section.
    *   Choose a mode (VS Bot, Local, Random Matchmaking, or Tournament).
    *   Select a map/galaxy if applicable.
    *   Follow matchmaking or game setup prompts.
5.  **Tournaments:**
    *   Create or join tournaments (requires setting a tournament alias in settings).
    *   Follow the bracket and play matches when prompted.
6.  **Friends:** Search for users, send/accept friend requests, and see online status.
7.  **Chat:** Select a friend from your list or conversations to start chatting in real-time.
8.  **Settings:** Update profile information, change password, manage 2FA, customize game appearance.

## Implemented Features (Based on Subject Modules)

Based on the structure and code, the following features, corresponding to modules described in the project subject, appear to be implemented in AstroPong:

**Major Features:**

*   **Standard User Management:** (Registration, login, profiles, avatars, friends, stats, history)
*   **Remote Authentication:** (Google Sign-in implementation)
*   **Live Chat:** (Dedicated chat system)
*   **Infrastructure Setup for Log Management (ELK):** (ELK stack configuration)
*   **Two-Factor Authentication (2FA) and JWT:** (JWT authentication and OTP-based 2FA)

**Minor Features:**

*   **Database Integration (PostgreSQL):** (Data persistence using PostgreSQL)
*   **Frontend Toolkit (Tailwind CSS):** (Styling with Tailwind CSS)
*   **User and Game Stats Dashboards:** (Dashboards for displaying statistics)
*   **Monitoring System (Potential):** (Nginx port exposure suggests potential monitoring endpoint - *verification needed*)

## Security Considerations

*   **HTTPS:** Nginx is configured for SSL/TLS encryption on port 1443.
*   **Password Hashing:** Django's built-in password hashing mechanisms are used.
*   **JWT Security:** Authentication relies on JSON Web Tokens with appropriate lifetimes and secure handling (HttpOnly cookies).
*   **Input Validation:** Django forms/serializers and frontend validation help prevent invalid data.
*   **CSRF Protection:** Django provides default CSRF protection.
*   **Permissions:** Backend views use `IsAuthenticated` and potentially other DRF permissions to protect endpoints.
*   **Environment Variables:** Sensitive credentials (`.env`) are kept out of version control.
*   **Dependencies:** Regularly update dependencies to patch vulnerabilities.

## Makefile Commands

*   `make` or `make all`: Builds images and starts all services (`make build && make up`).
*   `make build`: Builds or rebuilds the Docker images for all services.
*   `make up`: Starts the services in detached mode.
*   `make down`: Stops and removes the containers.
*   `make restart`: Restarts all services.
*   `make logs`: Tails the logs from all running services.
*   `make state`: Shows the status of the running containers.
*   `make clean`: Stops and removes containers, networks.
*   `make fclean`: Performs `clean` and removes frontend build artifacts (`node_modules`, `.next`), backend migrations/pycache, and Docker volumes/cache. **Use with caution - data might be lost.**
*   `make dclean`: Performs `fclean` and *also removes database and ELK data volumes*. **WARNING: Destructive action, all persistent data will be lost.**
*   `make re`: Performs `fclean` then `all` (full rebuild and restart).
*   `make help`: Displays available make commands.

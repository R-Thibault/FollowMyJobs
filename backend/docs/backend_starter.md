# FollowMyJobs

FollowMyJobs WIP

## Prerequisites

Before running the project, make sure the following are installed on your machine:

- [Golang](https://golang.org/dl/) version 1.22 or higher
- A PostgreSQL database
- A Go dependency manager (Go Modules is recommended)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/R-Thibault/FollowMyJobs FollowMyJobs
   ```

2. Navigate to the project directory backend:

   ```bash
   cd FollowMyJobs/backend
   ```

3. Install the project dependencies using Go Modules (or another dependency manager):

   ```bash
   go mod tidy
   ```

4. Set up the environment variables as needed (e.g., for database connection). You can copy the `.env.sample` file, rename it to `.env`, and add your environment variables, or you can set the environment variables directly:

   ```bash
   export POSTGRES_USER=your_database_user
   export POSTGRES_PASSWORD=your_database_password
   export POSTGRES_NAME=your_database_name
   export POSTGRES_HOST=your_database_host
   export POSTGRES_PORT=your_db_port
   export JWT_KEY=your_secret_key
   export SENDGRID_API_KEY=your_sendgrid_api_key
   ```

5. Start Database with docker compose

   ```bash
   cd ..
   docker-compose -f docker-compose.dev.yml up -d
   ```

   Database seed will be automaticcly setup when the app start if needed

## Usage

### Starting the Application

To start the application:

```bash
go run *.go
```

### Starting the Application with Air (for Development)

Air is a Go utility that monitors code changes and automatically restarts the server, making it ideal for development.

To add the `air` command to your PATH:

```bash
   export PATH=$PATH:$(go env GOPATH)/bin
```

Then, run Air to start the application in development mode:

```bash
air
```

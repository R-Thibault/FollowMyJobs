# FollowMyJobs

FollowMyJobs is an open-source, lightweight tool designed to help job seekers organize and track their job applications. With a minimalist and user-friendly interface, it provides the essential functionality to manage the job search process and track application statuses.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Project Overview

**FollowMyJobs** is designed for job seekers who want a simple, no-frills solution for managing their job applications. It allows users to register with basic information and track their job applications without the need for extensive data entry.

## Features

- **Basic User Registration**: Users register with only an email and password.
- **Application Tracking**: Users can add jobs they’ve applied for, with details like job title, company, and current application status (e.g., "Under Review," "Interviewed," "Accepted," "Rejected").
- **Status Filtering**: Simple filters allow users to find applications based on their current status.
- **Reminders**: Set reminders for follow-up actions on applications.

## Getting Started

### Prerequisites

- **Golang**: Install the latest version from [Golang's official website](https://golang.org/).
- **Docker**: Docker is recommended for development and deployment.

### Quick Start

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/R-Thibault/FollowMyJobs.git
   cd FollowMyJobs
   ```

2. **Run the Backend**:

   - Follow the [Backend Starter Guide](./backend/docs/backend_starter.md) for detailed instructions on setting up and running the backend.

3. **Frontend Setup** (Optional):

   ```bash
   cd frontend
   npm install
   ```

### Testing

Tests in this project are automated using **Lefthook**, a powerful tool for managing Git hooks.

- **Pre-push Hooks**: Lefthook ensures that all tests are run before changes are push. This includes unit tests for controllers, services, and other backend components.

#### Quick Start: Setting Up Lefthook

To ensure Lefthook is working after cloning the repository, follow these steps:

##### Step 1: Install Lefthook

Choose one of the following installation methods:

- **With Go**:
  ```bash
  go install github.com/evilmartians/lefthook@latest
  ```

For other installation options, visit the [Lefthook Installation Guide](https://github.com/evilmartians/lefthook#install).

##### Step 2: Install Git Hooks

Run the following command in the project root to install Lefthook hooks:

```bash
lefthook install
```

- **Running Tests Manually**: You can still run tests manually if needed.
  ```bash
  cd backend
  go test ./...
  ```

## Documentation

- **[Backend Guidelines](./backend/docs/backend_guildeline.md)**: Best practices and conventions for backend development.
- **[Backend Routes](./backend/docs/backend_routes.md)**: A detailed description of the API routes available in the project.

## License

This project is licensed under a **modified MIT License** with non-commercial restrictions. See the [LICENSE](./LICENSE) file for more information.

## Acknowledgments

- Thanks to the open-source community for tools and inspiration.
- This project is powered by [Golang](https://golang.org/), [Next.js](https://nextjs.org/), and [Docker](https://www.docker.com/).

# FollowMyJobs

FollowMyJobs is an open-source, lightweight tool designed to help job seekers organize and track their job applications. With a minimalist and user-friendly interface, it provides the essential functionality to manage the job search process and track application statuses.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Getting Started](#getting-started)
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

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/R-Thibault/FollowMyJobs.git
   cd FollowMyJobs
   ```

2. **Set Up Environment Variables**:

   - Create a `.env` file in the project root and add your environment variables (e.g., database credentials, JWT secret).

3. **Install Backend Dependencies**:

   ```bash
   cd backend
   go mod download
   ```

4. **Install Frontend Dependencies**:

   ```bash
   cd frontend
   npm install
   ```

5. **Run the Application**:
   - **Backend**: Start the backend server
     ```bash
     cd backend
     air
     ```

### Testing

Tests will be added as the project progresses.

## License

This project is licensed under a **modified MIT License** with non-commercial restrictions. See the [LICENSE](./LICENSE) file for more information.

## Acknowledgments

- Thanks to the open-source community for tools and inspiration.
- This project is powered by [Golang](https://golang.org/), [Next.js](https://nextjs.org/), and [Docker](https://www.docker.com/).

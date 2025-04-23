# 🌼 AllergieApp

AllergieApp is a web application that allows users to track and visualize pollen levels in their area. Stay informed about pollen levels to manage allergies more effectively.

## 🚀 Getting Started

To run AllergieApp locally, you'll need to set up both the backend and the frontend. Follow the steps below to get started quickly.

## ✅ Prerequisites

Before you begin, ensure that you have the following installed on your machine:

-   [Docker](https://www.docker.com/products/docker-desktop) (for containerization)
-   [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) (for frontend development)

## 🛠️ Running the Project

To run the project, you'll need two terminal windows open—one for the backend and one for the frontend.

### Prerequisites

#### a. docker-compose

1. Copy `AllergieApp/docker-compose-example.yaml` and rename it to `docker-compose.yaml`.
2. Fill in the values for `POSTGRES_USER` and `POSTGRES_PASSWORD` as required.

#### b. appsettings

1. Copy `AllergieApp/PollenApi/appsettings-example.json` and rename it to `appsettings.json`.
2. Open the `appsettings.json` file and fill in the `Username` and `Password` fields in both connection strings.
3. Remove the comments in the file (e.g., // Vul dit zelf in) before saving it.

### 1. 🐳 Backend (Docker)

In the first terminal, navigate to the root directory of the project and run the following command:

```bash
cd AllergieApp
docker-compose up --build
```

This will spin up the backend services using Docker. It will:

-   Build the backend Docker container.
-   Set up all necessary services defined in `docker-compose.yml`.

### 2. 🌐 Frontend (Vite + React or other stack)

In the second terminal, navigate to the frontend directory and start the development server by running the following commands:

```bash
cd AllergieApp/PollenFrontend
npm install  # Run this only once to install dependencies
npm run dev  # Start the frontend development server
```

This will:

-   Install the required frontend dependencies using `npm`.
-   Start the frontend development server.

## 📁 Project Structure

Below is the structure of the project:

```plaintext
AllergieApp/
│
├── docker-compose-example.yml     # Docker configuration file for the backend
├── docker-compose.yml             # Create this by copying docker-compose-example and filling in the required values
├── PollenFrontend/                # Frontend application
├── PollenApi/                     # Backend API
│    ├───appsettings-example.json  # .net Backend settings
│    └───appsettings.json          # Create this by copying appsetings-example.json and filling in the required values
└── PollenApi.Tests/               # Backend API tests
```

## 💡 Notes

-   The frontend is typically accessible at [http://localhost:5173](http://localhost:5173) if using Vite.
-   Ensure Docker Desktop is running before starting the backend.

### Running the Backend Without Docker

If you want to run the backend without Docker for development:

1. Navigate to the backend directory (where the `.csproj` file is):

```bash
cd AllergieApp/PollenApi
```

Restore dependencies and run the backend:

```bash
dotnet restore
dotnet run
```

Note: You must have .NET SDK installed to run the backend outside of Docker.

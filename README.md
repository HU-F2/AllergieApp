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

### 2. 🌐 Frontend (Vite + Electron + React + TypeScript)

The frontend uses Vite, React, Electron, and TypeScript. You can run the app as a **web version** or as an **Electron desktop application**.

#### 📥 One-time dependency installation

Navigate in the terminal to the frontend folder and run:

```bash
npm install
```

✅ This command installs all packages listed in `package.json`.

💡 **Only run `npm install` again if:**

* You deleted the `node_modules/` folder.
* The dependencies in `package.json` where changed.

---

#### ▶️ Running as a **web app** in the browser

```bash
npm run dev:web
```

* Starts Vite in `web` mode.
* Automatically opens the web app in your default browser.
* The web app process continues running even after closing the browser tab. You must stop it manually in the terminal.

---

#### 🖥️ Running as an **Electron desktop app**

```bash
npm run dev:electron
```

* Starts Vite in `electron` mode.
* **Automatically launches the Electron desktop app**.

---

## 📁 Project Structure

Last updated: **10-05-2025**
Below is the structure of the project:

```plaintext
AllergieApp
├─ PollenBackend                         # Backend API project
│  ├─ appsettings.json                   # Configuratiebestand voor de backend (database connecties, etc.)
│  ├─ Controllers                        # API controllers voor verschillende entiteiten
│  ├─ Data
│  │  ├─ AppDbContext.cs                 # Database context voor Entity Framework
│  │  └─ Seeder.cs                       # Data seeding voor de database
│  ├─ Dockerfile                         # Docker configuratie voor backend image
│  ├─ Migrations                         # Database migraties (EF Core)
│  │  ├─ ...                             # Diverse migratiebestanden
│  │  └─ AppDbContextModelSnapshot.cs    # Huidige staat van het database model
│  ├─ Models                             # Domeinmodellen
│  ├─ PollenBackend.csproj               # Project configuratie
│  ├─ PollenBackend.http                 # HTTP requests voor API testing (REST Client)
│  ├─ Program.cs                         # Applicatie entry point
│  └─ Services                           # Business logic services
├─ PollenBackend.Tests                   # Unit tests voor de backend
│  ├─ Controllers                        # Controller tests
│  ├─ Services                           # Service tests
│  └─ TestData                           # Test mock data
├─ PollenFrontend                        # Frontend interface(s) project
│  ├─ dist                               # Gebouwde frontend assets (productie)
│  ├─ dist-electron                      # Gebouwde Electron applicatie (productie)
│  ├─ electron                           # Electron-specifieke code
│  │  ├─ main.ts                         # Hoofdproces configuratie
│  │  └─ preload.ts                      # Preload script voor Electron
│  ├─ images                             # Applicatie afbeeldingen
│  ├─ src
│  │  ├─ components                      # Herbruikbare UI componenten
│  │  ├─ contexts                        # React context providers
│  │  │  └─ LocationContext.tsx
│  │  ├─ pages                           # Pagina componenten
│  │  ├─ services                        # Frontend services voor API communicatie
│  │  ├─ utils                           # Hulp functies
│  │  |  └─ utilityFunctions.ts
│  |  ├─ main.tsx                        # Applicatie entry point
│  │  └─ App.tsx                         # Hoofd React component
│  ├─ package.json                       # Frontend dependencies en scripts
│  ├─ tsconfig.json                      # TypeScript configuratie
│  └─ vite.config.ts                     # Vite build configuratie
├─ docker-compose-example.yaml           # Docker configuratie voor het opzetten van de backend service
└─ README.md                             # Project documentatie
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

## Design

![Component Diagram zoomed out](https://github.com/user-attachments/assets/ae7b68bf-f032-4220-ad24-877476916643)
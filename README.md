# React Map Application with Mappable World API

Welcome to the **React Map Application** repository! This application integrates the Mappable World API to provide an interactive map experience with search functionality, location suggestions, and draggable markers.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
  - [Entering Your API Key](#entering-your-api-key)
  - [Searching for Locations](#searching-for-locations)
  - [Interacting with the Map](#interacting-with-the-map)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

---

## Overview

This application demonstrates how to build a secure, map-based React application using the Mappable World API. It includes both frontend and backend components to ensure that sensitive API keys are handled securely.

---

## Features

- **Interactive Map**: Display an interactive map centered on a default location.
- **Secure API Key Handling**: API keys are stored securely on the server side using sessions.
- **Search Functionality**: Users can search for locations with real-time suggestions.
- **Location Suggestions**: Autocomplete suggestions are provided as the user types.
- **Geocoding**: Selected locations are geocoded to display the precise location on the map.
- **Draggable Marker**: A marker is placed on the map, which users can drag to different locations.
- **Responsive Design**: The application is responsive and works on various screen sizes.

---

## Demo

[![React Map Application Demo](./src/assets/react.svg)](https://codesandbox.io/p/devbox/tjq8jv?migrateFrom=zjn239)


---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- **Node.js** (v14 or higher): [Download and install Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Mappable World API Key**: [Sign up or log in](https://mappable.world/) to get an API key for Mappable World.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/react-map-application.git
   cd react-map-application
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file**

   In the root directory, create a `.env` file and add the following variables:

   ```plaintext
   SESSION_SECRET=your_secret_key      # Replace with a secure session key
   PORT=5000                           # Port number for the backend server
   NODE_ENV=development                # Set to "production" for live deployment
   ```

---

## Running the Application

### Development Mode

To start both the backend server and the frontend development server concurrently, use:

```bash
npm run dev
```

- The backend server will run on `http://localhost:5000`.
- The frontend development server will run on `http://localhost:5173`.

### Production Mode

To build the frontend for production and serve it using the Express server:

1. **Build the frontend**:

   ```bash
   npm run build
   ```

2. **Start the server**:

   ```bash
   npm start
   ```

The Express server will serve both the API and the frontend static files on `http://localhost:5000`.

---

## Usage

### Entering Your API Key

Upon starting the application:

1. Open your web browser and navigate to `http://localhost:5000`.
2. You will be prompted to enter your Mappable World API key.
3. Enter your API key and click **Load Map**.

*Note: The API key is stored securely in the server session and is not exposed to the client.*

### Searching for Locations

- Use the search input at the top-left corner to search for locations.
- As you type, location suggestions will appear.
- Click on a suggestion to center the map on that location.

### Interacting with the Map

- **Draggable Marker**: A marker is placed at the center of the map, which you can drag to any location.
- **Map Movement**: You can pan and zoom the map using your mouse or touch gestures.
- **Marker Info**: The marker includes an interactive info window.

---

## Project Structure

```
react-map-application/
├── src/
│   ├── App.tsx                # Main application component
│   ├── index.tsx              # Entry point for React rendering
│   └── mappable.ts            # Module for initializing Mappable World components
├── dist/                      # Compiled static files for production
├── server.js                  # Express server handling backend logic
├── package.json               # Project dependencies and scripts
├── vite.config.js             # Configuration for Vite
├── tsconfig.json              # TypeScript configuration
└── ...
```

- **src/**: Source code for the React application.
  - **App.tsx**: Main application component, containing map, search, and API key handling logic.
  - **index.tsx**: Main entry point for rendering the React application.
  - **mappable.ts**: Module that initializes and configures Mappable components and settings.
- **dist/**: Contains the production build of the frontend generated by Vite.
- **server.js**: Express server for backend functions, handling API key management and request proxies.
- **package.json**: Lists project dependencies and defines key project scripts.
- **vite.config.js**: Configuration for Vite, specifying settings for development and production builds.
- **tsconfig.json**: Configures TypeScript options.

---

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - Lodash.debounce
- **Backend**:
  - Node.js
  - Express
  - Express-session
  - Axios
- **Map Services**:
  - Mappable World API
- **Others**:
  - dotenv (for managing environment variables)
  - Concurrently (for running scripts concurrently)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**

   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/Implication-web-components/react-map-application.git
   ```

3. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**

5. **Commit your changes**

   ```bash
   git commit -m "Add your commit message"
   ```

6. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**

   Go to the original repository and click on "Pull Requests", then "New Pull Request".

---

### Coding Standards

- **Use TypeScript** for type safety.
- **ESLint** rules are applied to maintain code consistency.
- **Prettier** is recommended for code formatting.

---

## License

This project is licensed under the [Apache License, Version 2.0](LICENSE).

```plaintext
© 2024 Mappable authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
```

---

## Acknowledgements

- [Mappable World](https://mappable.world/) for providing the map API.
- [React](https://reactjs.org/) for the frontend framework.
- [Express](https://expressjs.com/) for the backend framework.
- [Vite](https://vitejs.dev/) for the development server and build tool.

---

## Contact

- **Author**: Sultan Alyami
- **Email**: ssl55@hotmail.com
- **GitHub**: [sultanaalyami](https://github.com/sultanaalyami)
- **LinkedIn**: [LinkedIn](https://www.linkedin.com/in/sultan-alyami)

---


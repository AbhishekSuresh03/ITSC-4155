# Trailblazer

Trailblazer is a mobile application that lets users create and share real-time trails using live location tracking.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Mobile App](#running-the-mobile-app)
  - [Running the Server](#running-the-server)

## Features

- Profile management
- Create and share trails with live location tracking
- View trail details and user profiles

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Java Development Kit (JDK) 22
- Maven

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/AbhishekSuresh03/trailblazer.git
    cd trailblazer
    ```

2. Install dependencies for the mobile app:

    ```sh
    cd mobile
    npm install
    ```

3. Install dependencies for the server:

    ```sh
    cd server
    ./mvnw clean install
    ```

### Running the Mobile App

1. Start the Expo development server:

    ```sh
    cd mobile
    expo start
    ```

2. Follow the instructions in the terminal to open the app on an emulator or a physical device.

### Running the Server

1. Start the server:

    ```sh
    cd server
    ./mvnw spring-boot:run
    ```

2. The server will be running at `http://localhost:8080`.

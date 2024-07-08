# Spotify Top Artists Viewer

<h1>Configuration</h1>
This application allows users to log in with their Spotify account and view their top artists. The application uses the Spotify Web API to fetch and display the user's top artists.

## Prerequisites

- Node.js and npm installed
- Spotify Developer account
- A registered Spotify application

## Setup

### 1. Register Your Application with Spotify

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) and log in.
2. Click on **Create an App**.
3. Fill in the required details and click **Create**.
4. Note down the **Client ID** and **Client Secret** from the app details page.
5. Add a Redirect URI (`http://localhost:8888/callback`) in the app settings.

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/spotify-top-artists-viewer.git
cd spotify-top-artists-viewer
```

### 3. Install Dependencies
```bash
npm install
```
### 4. Configure the Application
Create a file named .env in the root directory and add your Spotify application's Client ID, Client Secret, and Redirect URI:
```bash
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:8888/callback
```
### 5. Run the Application
```bash
npm start
```
The application will open in your default web browser at (http://localhost:8888).

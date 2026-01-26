# DevTinder Frontend

A modern, Tinder-style frontend for the DevTinder application built with React and Vite.

## Features

- 🎨 **Beautiful UI**: Modern, gradient-based design inspired by Tinder
- ⚡ **Fast**: Built with Vite for lightning-fast development
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices
- 🎯 **Swipeable Cards**: Interactive card swiping with Framer Motion
- 🔐 **Authentication**: Login and Signup with JWT cookies
- 👤 **Profile Management**: View and edit your profile
- 💌 **Connection Requests**: Accept or reject connection requests
- 🤝 **Connections**: View all your accepted connections

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3001`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── UserCard.jsx  # Swipeable user card component
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Feed.jsx
│   │   ├── Profile.jsx
│   │   ├── Requests.jsx
│   │   └── Connections.jsx
│   ├── services/         # API service layer
│   │   └── api.js
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
└── vite.config.js
```

## API Configuration

Make sure your backend is running on `http://localhost:3000`. The frontend is configured to proxy API requests to the backend.

## Features Overview

### Feed Page
- Swipeable user cards (drag or use buttons)
- Swipe right to show interest, left to pass
- Infinite scroll with pagination
- Beautiful card animations

### Profile Page
- View your profile information
- Edit profile details (photo, bio, about, skills, gender)
- Change password

### Requests Page
- View all received connection requests
- Accept or reject requests
- See user details before deciding

### Connections Page
- View all your accepted connections
- See connection profiles with skills and bio

## Technologies Used

- **React 18**: UI library
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server
- **Framer Motion**: Animation library for smooth card swiping
- **Axios**: HTTP client for API calls
- **React Icons**: Icon library

## Notes

- The app uses cookie-based authentication
- Make sure CORS is properly configured on the backend
- The backend should be running before starting the frontend


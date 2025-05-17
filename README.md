# CodeCast

**CodeCast** is a fullstack, developer-focused video sharing platform with multi-role support (viewer, creator, admin), real-time features, analytics, and extras like code snippet overlays, skill tag leaderboards, watch parties, public creator portfolios, and quizzes.

---

## 📸 Screenshots

> Replace the image paths below with your actual screenshot files (e.g., `/screenshots/landing.png`)

| Landing Page | Video Player | Creator Dashboard | Watch Party |
|:------------:|:------------:|:----------------:|:-----------:|
| ![](screenshots/landing.png) | ![](screenshots/videoplayer.png) | ![](screenshots/creator_dashboard.png) | ![](screenshots/watchparty.png) |

---

## 🚀 Features

### Core Features
- **User Authentication**: Register, login, JWT-based auth, role-based access (viewer, creator, admin)
- **Video Upload & Playback**: Creators can upload videos (YouTube or direct), viewers can watch with code overlays
- **Video Listing & Search**: Filter, search, sort, and paginate videos by tag, category, difficulty
- **Comments & Reactions**: Comment, like, dislike, and react to videos (with auto-moderation for banned keywords)
- **Playlists**: Create, view, and delete playlists, including "Watch Later"
- **Watch History**: Track and view your recently watched videos
- **Analytics**: View video stats (views, likes, dislikes, top videos, tag leaderboard)
- **Admin Dashboard**: Manage users, videos, comments, ban/suspend users, moderate content
- **Creator Dashboard**: View your video stats, top videos, and analytics
- **Public Creator Portfolio**: Public page for each creator with badges for milestones

### Real-Time & Social Features
- **Watch Parties**: Real-time video sync and chat with Socket.io
- **Live Chat**: Chat with others during watch parties

### Learning & Engagement
- **Code Snippet Overlays**: Time-synced code snippets appear during video playback
- **Quizzes**: Take quizzes after videos to reinforce learning
- **Skill Tag Leaderboard**: See trending tags and top skills

### Extras
- **Creator Badges**: Earn badges for milestones (uploads, views, likes)
- **Auto-Moderation**: Banned keywords in comments are filtered
- **Responsive, Modern UI**: Built with React, Bootstrap, and custom styles

---

## 🛠️ Tech Stack
- **Frontend**: React, Bootstrap, Axios, React Router, Socket.io-client
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Socket.io
- **Database**: MongoDB Atlas (cloud-hosted)
- **Architecture**: MVC, RESTful API, real-time with Socket.io

---

## 🗂️ Project Structure & Code Features

### Backend (`/backend`)
- **Express.js REST API** with modular route files for each resource (auth, videos, comments, reactions, playlists, analytics, admin, watch party, history, portfolio, quiz)
- **Mongoose Models** for User, Video, Comment, Reaction, Playlist, WatchHistory, TagStats, WatchParty
- **Authentication & Authorization**: JWT-based, middleware for role checks (viewer, creator, admin)
- **Real-Time**: Socket.io for watch party sync and chat
- **Auto-Moderation**: Middleware for banned keywords in comments
- **Analytics**: Aggregation endpoints for views, likes, top tags, top creators
- **Admin Tools**: Endpoints for user/video/comment moderation, ban/suspend, analytics
- **Creator Tools**: Endpoints for uploading, editing, deleting videos, managing playlists, and portfolios
- **Quiz Support**: Endpoints for video quizzes and results
- **MVC Structure**: `routes/`, `models/`, `controllers/`, `middleware/`
- **Environment Config**: `.env` for MongoDB URI, JWT secret, etc.

**Example Backend Folder Structure:**
```
backend/
  models/           # Mongoose schemas (User, Video, ...)
  routes/           # Express route files (video.js, auth.js, ...)
  controllers/      # (optional) Controller logic
  middleware/       # Auth, moderation, etc.
  server.js         # App entry point
  .env              # Environment variables
```

### Frontend (`/frontend/codecast`)
- **React SPA** with role-based navigation and protected routes
- **Pages**: Login, Register, Video List, Video Player, Video Upload, Playlists, Creator/Admin Dashboards, Portfolio, Watch Party
- **Components**: NavBar, Comments, Reactions, Quiz, TagLeaderboard, CreatorBadges, etc.
- **API Helpers**: `/api/` folder for all backend endpoints (auth, video, comment, reaction, analytics, playlist, quiz, tags, portfolio)
- **State Management**: React hooks, context for auth/user state
- **Real-Time**: Socket.io-client for watch party sync and chat
- **Responsive UI**: Bootstrap, custom CSS, modern cards/tables, hero landing page
- **Debounced Search & Sort**: For video listing
- **Error Handling**: User-friendly error messages and loading states
- **Code Highlighting**: Prism.js for code snippets overlay

**Example Frontend Folder Structure:**
```
frontend/codecast/
  src/
    api/            # API helper functions
    components/     # Reusable UI components
    pages/          # Route-based pages
    utils/          # Auth helpers, etc.
    App.js          # Main app
    index.js        # Entry point
  public/
  package.json
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/codecast.git
   cd codecast
   ```
2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```
3. **Install frontend dependencies**
   ```bash
   cd ../frontend/codecast
   npm install
   ```
4. **Set up environment variables**
   - In `backend/.env`, set your MongoDB URI:
     ```env
     MONGODB_URI=your_mongodb_atlas_uri
     JWT_SECRET=your_jwt_secret
     ```

### Running the App
- **Start the backend**
  ```bash
  cd backend
  npm start
  ```
- **Start the frontend**
  ```bash
  cd frontend/codecast
  npm start
  ```
- Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Usage
- **Register** as a viewer or creator
- **Creators**: Upload videos, add code snippets, quizzes, and manage your portfolio
- **Viewers**: Watch videos, join watch parties, comment, react, and add to playlists
- **Admins**: Moderate users, videos, and comments from the admin dashboard

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE)

---

## 💡 Credits
Built with ❤️ for the developer community.
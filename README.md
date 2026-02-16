# LinkedIn Community Platform

A modern, full-stack social networking platform built with Next.js, React, Firebase, MongoDB, and Express.js. This application provides essential LinkedIn-like features including user authentication, profile management, and a social feed for sharing posts.

## 🚀 Features

### ✅ User Authentication
- Firebase Authentication for secure login/registration
- Email and password authentication
- Protected routes and user sessions
- Automatic user profile creation

### ✅ User Profiles
- Personalized user profiles with name, email, and bio
- Profile editing capabilities
- User avatars with initials fallback
- Individual user post history

### ✅ Social Feed
- Create and publish text posts
- Real-time feed updates
- Post timestamps and author information
- Clean, LinkedIn-inspired UI

### ✅ Responsive Design
- Modern UI built with Tailwind CSS
- Shadcn UI components for consistent design
- Mobile-responsive layout
- Dark mode support

### ✅ Search Functionality
- Modern UI built with Tailwind CSS and Lucide icons
- Mobile Responsive
- Search People, Post
- Particular Search page

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - High-quality UI components
- **Lucide React** - Beautiful icons
- **Lenis** - Smooth Scrolling
- **Swiper** - Smooth swiper for media

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - Document database
- **Mongoose** - MongoDB object modeling

### Authentication
- **Firebase Auth** - User authentication and management

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Firebase project setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd linkedin
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run server:install
```

### 3. Environment Configuration

#### Frontend Environment
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

#### Backend Environment
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/linkedin
PORT=5000
```

### 4. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Get your Firebase configuration from Project Settings
4. Update the environment variables with your Firebase config

### 5. MongoDB Setup
- **Local MongoDB**: Install MongoDB locally and ensure it's running on port 27017
- **MongoDB Atlas**: Create a cluster and update the MONGODB_URI in your environment file

### 6. Start the Application

#### Development Mode
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend development server
npm run dev
```

### 7. Access the Application
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

## 🔗 API Endpoints

### Users
- `GET /api/users/:firebaseUid` - Get user profile
- `POST /api/users` - Create/update user profile
- `PUT /api/users/:firebaseUid` - Update user profile
- `POST /api/users/complete-profile` - Complete user profile
- `GET /api/users/search` - Search Result User

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:postId` - Get specific post
- `GET /api/posts?userId=:userId` - Get posts by user
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:postId` - Update post
- `DELETE /api/posts/:postId` - Delete post
- `POST /api/posts/:postId/like` - Like/unlike post
- `POST /api/posts/:postId/share` - Share post

### Comments
- `GET /api/posts/:postId/comments` - Get post comments
- `POST /api/posts/:postId/comments` - Add comment
- `DELETE /api/comments/:commentId` - Delete comment

### File Upload
- `POST /api/upload` - Upload media files

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with email/password
2. **Profile Creation**: Automatic profile creation in MongoDB
3. **Login**: Firebase handles authentication
4. **Protected Routes**: AuthContext provides user state
5. **Logout**: Clean session termination

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Create a new app on your preferred platform
2. Set environment variables
3. Deploy the `server` directory

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update the MONGODB_URI environment variable
3. Ensure network access is configured

## 🛡 Security Features

- Firebase Authentication for secure user management
- Environment variables for sensitive configuration
- CORS protection for API endpoints
- Input validation and sanitization
- Protected API routes

---

**Happy coding! 🚀**

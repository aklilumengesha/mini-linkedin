# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js 14 App Router, React, Tailwind CSS)              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Layer                      │
│                    (Firebase Auth)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│              (Route Handlers, Server Actions)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Express)                     │
│              (REST API, Business Logic)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │    MongoDB       │  │   Cloudinary     │
        │   (Database)     │  │  (Media Storage) │
        └──────────────────┘  └──────────────────┘
```

## Frontend Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   ├── auth/              # Authentication pages
│   ├── profile/           # Profile pages
│   ├── search/            # Search page
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # React components
├── context/               # React context providers
├── hooks/                 # Custom React hooks
└── lib/                   # Utility libraries

```

### Key Components

- **AuthContext**: Manages user authentication state
- **PostFeed**: Displays list of posts with infinite scroll
- **CreatePost**: Post creation with media upload
- **PostCard**: Individual post display with interactions
- **Header**: Navigation and user menu

## Backend Architecture

### Directory Structure

```
server/
├── config/                # Configuration files
├── models/                # MongoDB models
├── routes/                # Express routes
├── middleware/            # Custom middleware
├── utils/                 # Utility functions
└── index.js              # Server entry point
```

### API Endpoints

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `POST /api/users/complete-profile` - Complete profile

#### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment
- `DELETE /api/posts/:id/comment/:commentId` - Delete comment
- `POST /api/posts/:id/share` - Share post

#### Upload
- `POST /api/upload` - Upload media files

#### Search
- `GET /api/search?q=query` - Search users and posts

## Data Models

### User Model
```javascript
{
  firebaseUid: String,
  name: String,
  email: String,
  profilePicture: String,
  bio: String,
  location: String,
  website: String,
  createdAt: Date
}
```

### Post Model
```javascript
{
  author: ObjectId,
  content: String,
  media: [String],
  likes: [ObjectId],
  comments: [{
    user: ObjectId,
    text: String,
    createdAt: Date
  }],
  shares: Number,
  createdAt: Date
}
```

## State Management

- **React Context**: Global authentication state
- **Local State**: Component-specific state with useState
- **Server State**: API data fetching with native fetch

## Authentication Flow

1. User signs up/logs in via Firebase Auth
2. Firebase returns user credentials
3. Frontend creates/fetches user in MongoDB
4. User data stored in AuthContext
5. Protected routes check authentication status

## Media Upload Flow

1. User selects media files
2. Files uploaded to Cloudinary
3. Cloudinary returns URLs
4. URLs stored in MongoDB with post data

## Real-time Updates

- Firebase Realtime Database for notifications
- Optimistic UI updates for instant feedback
- Polling for feed updates (can be upgraded to WebSockets)

## Security Considerations

- Firebase Auth for secure authentication
- Environment variables for sensitive data
- Input validation on backend
- CORS configuration
- Rate limiting (recommended for production)
- SQL injection prevention with Mongoose

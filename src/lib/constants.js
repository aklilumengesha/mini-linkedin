export const APP_NAME = 'LinkedIn Clone';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/profile',
  PROFILE_COMPLETE: '/profile/complete',
  SEARCH: '/search',
};

export const API_ENDPOINTS = {
  USERS: '/users',
  POSTS: '/posts',
  UPLOAD: '/upload',
  SEARCH: '/search',
};

export const POST_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

export const TOAST_DURATION = 3000;

export const DEBOUNCE_DELAY = 500;

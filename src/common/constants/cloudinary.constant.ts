export const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

export const CLOUDINARY_FOLDERS = {
  HOTELS: 'hotels',
  ROOMS: 'rooms',
  ROOM_TYPES: 'room-types',
  USERS: 'users',
};

export const UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  transformations: {
    quality: 'auto:good',
    fetch_format: 'auto',
    crop: 'limit',
    width: 1920,
    height: 1080,
  },
};

export const CLOUDINARY_URL_PREFIX = 'https://res.cloudinary.com';

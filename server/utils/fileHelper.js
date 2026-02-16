const path = require('path');

const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.includes(getFileExtension(filename));
};

const isVideoFile = (filename) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.includes(getFileExtension(filename));
};

const generateUniqueFilename = (originalFilename) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const ext = getFileExtension(originalFilename);
  const nameWithoutExt = path.basename(originalFilename, ext);
  return `${nameWithoutExt}-${timestamp}-${random}${ext}`;
};

const validateFileSize = (fileSize, maxSize = 10 * 1024 * 1024) => {
  return fileSize <= maxSize;
};

module.exports = {
  getFileExtension,
  isImageFile,
  isVideoFile,
  generateUniqueFilename,
  validateFileSize,
};

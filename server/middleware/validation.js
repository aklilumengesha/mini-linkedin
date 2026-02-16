const validatePost = (req, res, next) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Post content is required',
    });
  }

  if (content.length > 3000) {
    return res.status(400).json({
      success: false,
      message: 'Post content must be less than 3000 characters',
    });
  }

  next();
};

const validateUser = (req, res, next) => {
  const { name, email, firebaseUid } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Name is required',
    });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required',
    });
  }

  if (!firebaseUid) {
    return res.status(400).json({
      success: false,
      message: 'Firebase UID is required',
    });
  }

  next();
};

const validateComment = (req, res, next) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Comment text is required',
    });
  }

  if (text.length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Comment must be less than 500 characters',
    });
  }

  next();
};

module.exports = {
  validatePost,
  validateUser,
  validateComment,
};

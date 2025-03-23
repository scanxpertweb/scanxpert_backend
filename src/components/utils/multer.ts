import multer from 'multer';
import path from 'path';

// Multer setup - store files temporarily in memory or disk
const storage = multer.memoryStorage(); // or use diskStorage if needed

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

export const reportUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

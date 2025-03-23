import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config'; 

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_reports',
    allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
    // 👇 TS fix: cast to any to allow resource_type
    resource_type: 'auto' as any,
  } as any, // force type to bypass error
});

export const reportUpload = multer({ storage });

import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Upload a buffer file to Cloudinary
export const uploadToCloudinary = (fileBuffer: Buffer, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: `reports/${fileName}`, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        if (result?.secure_url) return resolve(result.secure_url);
        reject(new Error('Cloudinary upload failed'));
      }
    );

    // Convert buffer to readable stream
    const readable = new Readable();
    readable._read = () => {};
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

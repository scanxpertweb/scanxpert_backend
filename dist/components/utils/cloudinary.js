"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Upload a buffer file to Cloudinary
const uploadToCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ public_id: `reports/${fileName}`, resource_type: 'auto' }, (error, result) => {
            if (error)
                return reject(error);
            if (result === null || result === void 0 ? void 0 : result.secure_url)
                return resolve(result.secure_url);
            reject(new Error('Cloudinary upload failed'));
        });
        // Convert buffer to readable stream
        const readable = new stream_1.Readable();
        readable._read = () => { };
        readable.push(fileBuffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;

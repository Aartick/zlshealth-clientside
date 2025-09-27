import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
// To be used on server side only in any API route or server components
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

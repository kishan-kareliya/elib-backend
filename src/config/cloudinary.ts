import { v2 as cloudinary } from 'cloudinary';
import { config } from './config';

// Configuration
cloudinary.config({ 
    cloud_name: config.cloudinaryCloudName, 
    api_key: config.cloudinaryCloudApiKey, 
    api_secret: config.cloudinaryCloudApiSecret 
});

export default cloudinary;
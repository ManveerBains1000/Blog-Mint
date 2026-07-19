import {v2 as cloudinary} from 'cloudinary'
import fs from "fs";
import { ApiError } from './ApiError.js';
import { ENV } from './env.js';

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret:ENV.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto",
            }
        );

        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);

        return null;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log("Cloudinary delete error:",error.message);
    }
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary,
}


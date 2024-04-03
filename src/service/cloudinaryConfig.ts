import  cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name:process.env.REACT_APP_CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.REACT_APP_CLOUDINARY_API_KEY as string,
    api_secret:process.env.REACT_APP_CLOUDINARY_API_SECRET as string,
    
    
})

export default cloudinary;
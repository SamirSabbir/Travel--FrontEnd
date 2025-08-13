import axios from "../../api/axios";
import Cookies from "js-cookie";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; 

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed for ${file.name}`);
    }

    const data = await response.json();
    return {
      url: data.url,
      secureUrl: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error(`Upload error for ${file.name}:`, error);
    throw error;
  }
};

export const updateProfile = async (updateUrl, formData, photoFIle) =>{
    try{
        let photoUrl = null;

        //upload new photo if provided
        if(photoFIle){
            const cloudinaryResponse = await uploadImageToCloudinary(photoFIle);
            photoUrl = cloudinaryResponse.secureUrl;
        }

        //create payload
        const payload ={
            name: formData.name,
            ...(formData.password.trim() !== "" && { password: formData.password }),
            ...(photoUrl && {photo: photoUrl})
        };

        const response = await axios.patch(updateUrl,payload);


        //update cookie  if photo was updated
         if (photoUrl) {
       const userCookie = Cookies.get("user");
       if(userCookie){
        try{
            const userObj = JSON.parse(userCookie);
            const updateUser = {...userObj,photo:photoUrl};
            Cookies.set("user", JSON.stringify(updateUser),{expires:7});
        } catch (err){
            console.log("Failed to parse user cookie",err);
        }
       }
    }
    return response.data;
    }
    catch(error){
        alert(error);
        console.log(error);
    }
}
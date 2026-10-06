import { Cloudinary } from '@cloudinary/url-gen';
import { upload } from 'cloudinary-react-native';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params';

export const cld = new Cloudinary({ 
    cloud: { 
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'r7arrbrw',
    },
    url: {
        secure: true
    }
});

        export const uploadImage = async (file: string) => {
            const options: UploadApiOptions = {
                    upload_preset: 'Default',
                    tag: 'Default',
                    unsigned: true,
                    resource_type: 'auto',
                }

            return new Promise<UploadApiResponse>(async (resolve, reject) => {
                // upload image to cloudinary

                await upload(cld, {
                    file,
                    options: options,
                    callback: (error, response) => {
                        if (error || !response){
                            reject(error);
                            alert(error?.message || "An error occurred while uploading the image.");
                        }else{
                            resolve(response);
                        }
                    //.. handle response
                }})
            })
        }

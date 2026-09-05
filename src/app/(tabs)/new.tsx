import { View, Image, Text, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import Button from "~/src/components/Button";
import { uploadImage } from "~/src/lib/cloudinary";
import React from "react";

export default function CreatePost(){
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if(!image){
            pickImage();
        }
    },[image]);

        const pickImage = async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            });

            if(!result.canceled){
                setImage(result.assets[0].uri);
            }
        }

        const createPost = async () => {
            if (!image) {
                return;
            }
            const response = await uploadImage(image);
            //save post in database`
            console.log("image id: ", response?.public_id)
        }

    return(
        <View className="p-3 items-center flex-1"> 

            {/* Image picker */}

            {image ? (<Image 
            source={{ 
                uri: image, 
                }}
                className="w-52 aspect-[4/3] rounded-lg bg-slate-300"
            />) : (
            <View className="w-52 aspect-[3/4] rounded-lg bg-slate-300"/>
            )}

            <Text onPress={pickImage} className="text-blue-500 font-semibold m-5">Change</Text>

            {/* Text input for caption */}

            <TextInput
            value={caption}
            onChangeText={(newValue)=> setCaption(newValue)}
            placeholder="What is on your mind?" 
            className='bg-blue-500 w-full p-3'
            />

            {/* Button */}
            <View className="mt-auto w-full">
                <Button title="Share" onPress={createPost}/>
            </View>
        </View>
    )
}
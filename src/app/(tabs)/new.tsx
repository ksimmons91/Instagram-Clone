import { View, Image, Text, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import Button from "~/src/components/Button";
import { uploadImage } from "~/src/lib/cloudinary";
import React from "react";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider";
import { router } from "expo-router";
import { appStyles } from "~/src/lib/styles";
import { useVideoPlayer, VideoView } from 'expo-video';
import { Audio, ResizeMode, Video } from 'expo-av';

export default function CreatePost(){
    const [caption, setCaption] = useState('');
    const [media, setMedia] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'video' | 'image' | undefined>();

    const styles = appStyles;

    const { session } = useAuth();

    useEffect(() => {
        if(!media){
            pickMedia();
        }
    },[media]);

        const pickMedia = async () => {
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

            console.log(result.assets[0].uri.slice(5, result.assets[0].uri.length));

            if(!result.canceled){
                setMedia(result.assets[0].uri);
                setMediaType(result.assets[0].type);
                // console.log(JSON.stringify(result.assets[0], null, 2));
            }
        }

        const createPost = async () => {
            if (!media) {
                return;
            }
    
            const blob = await fetch(media).then((response) => response.blob());

            const formData = new FormData();
            formData.append('file', blob, 'upload.jpg');
            formData.append('upload_preset', 'Default');
            formData.append('resource_type', 'auto');

            const response = await fetch(
            `https://api.cloudinary.com/v1_1/r7arrbrw/${mediaType}/upload`,
            { method: 'POST', body: formData }
            );

            const result = await response.json();
            console.log("Cloudinary public ID: ", result?.public_id);

            if (!response.ok) {
            throw new Error(result.error?.message || 'Upload failed');
            }
            
            const { data, error } = await supabase
            .from('posts')
            .insert([
                { 
                caption, 
                image: result?.public_id, 
                user_id: session?.user.id,
                },
            ])
            .select();

            if (error) {
                Alert.alert('Could not save post', error.message);
                return;
                }

                router.push('/(tabs)');

            // const response = await uploadImage(image);
            // //save post in database
            // console.log("image id: ", response?.public_id)
        }

    return(
        <View className="p-3 items-center flex-1"> 

            {/* Image picker */}
            {!media ? (
                <View className="w-52 aspect-[3/4] rounded-lg bg-slate-300"/>
            ) : mediaType === 'image' ? (
                <Image 
                    source={{ 
                    uri: media, 
                    }}
                    style={styles.image} 
                    className="w-52 aspect-[4/3] rounded-lg bg-slate-300"
                />
            ) : (
                <Video
                    className="w-52 aspect-[4/3] rounded-lg bg-slate-300"
                    style={{ width: '75%', aspectRatio: 1 }}
                    source={{
                        uri: media,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                    shouldPlay
                />
            )
        }

            <Text onPress={pickMedia} className="text-blue-500 font-semibold m-5">Change</Text>

            {/* Text input for caption */}

            <TextInput
            value={caption}
            onChangeText={(newValue) => setCaption(newValue)}
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
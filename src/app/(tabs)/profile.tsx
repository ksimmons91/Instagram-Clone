import { Text, View, Image, TextInput } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import Button from "~/src/components/Button";
import React from "react";
import { supabase } from "~/src/lib/supabase";

export default function ProfileScreen(){
    const [image, setImage] = useState<string | null>(null);
    const [username, setUsername] = useState('');

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
        alert('Permission to access the media library is required.');
        return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        });

        if(!result.canceled){
            setImage(result.assets[0].uri);
        }
    }

    return(
        <View className="p-3 flex-1">
            {/* Avatar image picker */}
             {image ? (
                <Image 
                    source={{ 
                        uri: image 
                        }}
                        className="w-52 aspect-square self-center rounded-full bg-slate-300"
                />) : (
                <View className="w-52 aspect-square rounded-full bg-slate-300" />
                )}
                <Text onPress={pickImage} className="text-blue-500 font-semibold m-5 self-center">Change</Text>
            {/* Form */}
            <Text className="mb-2 text-gray-300 font-semibold">Username</Text>
            <TextInput 
                placeholder="Username" 
                value={username} 
                onChangeText={setUsername}
                className='border border-gray-300 p-2 rounded-md' 
            />

            {/* Button */}
            <View className="gap-2 mt-auto">
                <Button title="Update profile"/>
                <Button title="Sign out" onPress={() => supabase.auth.signOut()}/>
            </View>
        </View>
    )
}
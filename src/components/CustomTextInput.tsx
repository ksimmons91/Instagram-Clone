import { Text, TextInput } from "react-native";
import React from "react";

export default function CustomTextInput({ label, ...textInputProps }){
    return(
        <>
        <Text className="mb-2 text-gray-500 font-semibold">{label}</Text>
        <TextInput 
            {...textInputProps}
            className='border border-gray-300 p-2 rounded-md'
        />
        </> 
    )
}
import { Stack } from "expo-router";
import AuthProvider from "../providers/AuthProvider";
import React from "react";
import '../../global.css'

export default function RootLayout(){
    return  (
    <AuthProvider>
        <Stack screenOptions={{headerShown: false}}/>
    </AuthProvider>
    )
}
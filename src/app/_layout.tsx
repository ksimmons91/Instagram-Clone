import { Slot, Stack, Tabs } from "expo-router";
import AuthProvider from "../providers/AuthProvider";
import React from "react";

export default function RootLayout(){
    return  (
    <AuthProvider>
        <Stack screenOptions={{headerShown: false}}/>
    </AuthProvider>
    )
}
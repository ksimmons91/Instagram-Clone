import { Redirect } from "expo-router";
import React from "react";
import { useAuth } from "~/src/providers/AuthProvider";

export default function Home(){
    const {isAuthenticated} = useAuth();

    if(isAuthenticated){
        return(
            <Redirect href="/(tabs)" />
        )
    } 
    return(
        <Redirect href="/(auth)" />
    )
}
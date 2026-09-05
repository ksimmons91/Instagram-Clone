import { Link, Redirect } from "expo-router";
import { Text } from "react-native";
import React from "react";

export default function Home(){
    return(
        <Redirect href="/(auth)" />
    )
}
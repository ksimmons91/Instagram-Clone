import { Text, View, Image, FlatList, useWindowDimensions } from "react-native";
import posts from "~/assets/data/posts.json";
import {Ionicons, Feather, AntDesign} from "@expo/vector-icons"
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from "~/src/lib/cloudinary";

export default function PostListItem({ post }) {
    const { width, height } = useWindowDimensions();
    
    const image = cld
        .image(post.image)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(width).height(width));

        const avatar = cld.image(post.user.avatar_url);
        avatar.resize(auto().gravity(autoGravity()).width(48).height(48))

    return(
        <View className="bg-white">
            {/* Header */}
            <View className="p-3 flex-row items-center gap-2">
                <AdvancedImage
                    cldImg={avatar}
                    className="w-12 aspect-square rounded-full"
                />
                <Text className="font-semibold text-2xl">{post.user.username}</Text>
            </View>

            {/* Content */}
            <AdvancedImage cldImg={image} className="w-full aspect-[4/3]" />

             {/* Icons */}
            <View className="flex-row gap-3 p-3">
                <AntDesign name="heart" size={20} />
                <Ionicons name="chatbubble-outline" size={20} />
                <Feather name="send" size={20} />
                <Feather name="bookmark" size={20} className="ml-auto" />
            </View>
        </View>
    )
}
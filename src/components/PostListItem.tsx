import React, { useEffect } from "react";
import { Text, View } from "react-native";
import {Ionicons, Feather, AntDesign} from "@expo/vector-icons"
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from 'cloudinary-react-native';
import { cld } from "~/src/lib/cloudinary";
import PostContent from "~/src/components/PostContent";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "../lib/supabase";
import { Octicons } from "@expo/vector-icons";
import { sendLikeNotification } from "../app/utils/notifications";

export default function PostListItem({ post }) {
    const [isLiked, setIsLiked] = React.useState(false);    
    const [likeRecord, setLikeRecord] = React.useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if(post.my_likes?.length > 0){
        setLikeRecord(post.my_likes[0])
        setIsLiked(true)
        }
    }, [post.my_likes])

    useEffect(() => {
        if(isLiked){
            saveLike();
        } else {
            deleteLike();
        }
    }, [isLiked])

    const fetchLike = async () => {
        const {data, error } = await supabase
        .from('likes')
        .select('*') // * = all columns
        .eq('user_id', user?.id)
        .eq('post_id', post.id)
        .single();

        console.log(error);

        if(data && data?.length > 0){
            setLikeRecord(data[0]);
            setIsLiked(true);
        }
    }

    const saveLike = async () => {
        if(likeRecord){
            return;
        }
        const { data, error } =await supabase
        .from('likes')
        .insert([{user_id: user?.id, post_id: post.id}])
        .select();
        
        sendLikeNotification((data?.[0]));

        setLikeRecord(data?.[0]);
    }

    const deleteLike = async () => {
        if(likeRecord){
        const { error } =await supabase
        .from('likes')
        .delete()
        .eq('id', likeRecord.id)

            if(!error){
                setLikeRecord(null);
            }
        }
    }

    const avatar = cld.image(post.user.avatar_url || "Default_pfp");
    avatar.resize(auto().gravity(autoGravity()).width(48).height(48))


    return(
        <View className="bg-white">
            {/* Header */}
            <View className="p-3 flex-row items-center gap-2">
                <AdvancedImage
                    cldImg={avatar}
                    className="w-12 aspect-square rounded-full"
                />
                <Text className="font-semibold text-2xl">
                    {post.user.username || "New user"}
                </Text>
            </View>

            {/* Content */}
             <PostContent post={post} />  

            <View className="px-3 gap-1">
                <Text className="font-semibold">{
                (post.likes?.[0]?.count === 1? "1 like" : 
                post.likes?.[0]?.count + " likes" || 0 + " likes")}</Text>
                <Text className="font-semibold">{post.user.username || "New user"}{' '}</Text>
                <Text className="font-semibold">{post.caption}</Text>
            </View>

             {/* Icons */}
            <View className={`flex-row gap-2 p-3`}>
                {isLiked ? 
                <AntDesign 
                    onPress={() => setIsLiked(!isLiked)} 
                    name={isLiked ? 'heart' : 'hearto'} 
                    size={20} 
                    color={isLiked ? "crimson" : "black"}
                /> :
                <Octicons
                onPress={() => setIsLiked(!isLiked)}  
                name="heart" 
                size={24} 
                color="black" />
                }
                <Ionicons name="chatbubble-outline" size={20} />
                <Feather name="send" size={20} />
                <Feather name="bookmark" size={20} className="ml-auto" />
            </View>
        </View>
    )
}
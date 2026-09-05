import { Text, View, Image, FlatList } from "react-native";
import posts from "~/assets/data/posts.json";
import {Ionicons, Feather, AntDesign} from "@expo/vector-icons"
import PostListItem from "~/src/components/PostListItem";
import { height, width } from "~/src/components/PostListItem";

export default function FeedScreen(){
    return(

        <FlatList 
            data={posts}
            renderItem={({ item }) => <PostListItem post={item} width={width} />}
            contentContainerStyle={{ 
                gap: 10, 
                maxWidth: 512,
                alignSelf: "center", 
                width: "100%", 
            }}
            showsVerticalScrollIndicator={false}
        />

        // <View> 
        //     <PostListItem post={posts[0]} />
        //     <PostListItem post={posts[1]} />
        // </View>
    )
}
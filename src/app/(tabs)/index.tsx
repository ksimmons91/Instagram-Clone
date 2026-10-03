import { FlatList } from "react-native";
import posts from "~/assets/data/posts.json";
import PostListItem from "~/src/components/PostListItem";
import { width } from "~/src/components/PostListItem";
import React from "react";
import { supabase } from "~/src/lib/supabase";

export default function FeedScreen(){
    const [post, setPosts] = React.useState([]);

    React.useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        let { data, error } = await supabase
        .from('posts')
        .select('*, user:profiles(*)');
        if (error) {
            alert('Something went wrong')
        }
        setPosts(data);
    }

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
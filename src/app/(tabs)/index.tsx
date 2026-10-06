import { FlatList } from "react-native";
import posts from "~/assets/data/posts.json";
import PostListItem from "~/src/components/PostListItem";
import React from "react";
import { supabase } from "~/src/lib/supabase";

export default function FeedScreen(){
    const [newPosts, setNewPosts] = React.useState([]);

    React.useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        let { data, error } = await supabase
        .from('posts')
        .select('*, user:profiles(*)')
        // .eq('user_id', user?.id) 
        .order('created_at', {ascending: false});
        
        if (error) {
            alert('Something went wrong')
        }
        setNewPosts(data);
    }

    return(

        <FlatList
            keyExtractor={(item) => String(item.id)}
            data={[...posts, ...newPosts]}
            renderItem={({ item }) => <PostListItem post={item}/>}
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
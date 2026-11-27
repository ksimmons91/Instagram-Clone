import { FlatList } from "react-native";
import posts from "~/assets/data/posts.json";
import PostListItem from "~/src/components/PostListItem";
import React from "react";
import { supabase } from "~/src/lib/supabase";
import { useAuth } from "~/src/providers/AuthProvider"

export default function FeedScreen(){
    const [newPosts, setNewPosts] = React.useState([]);
    const[loading, setLoading] = React.useState(false);
    const { user } = useAuth();

    React.useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);

        let { data, error } = await supabase
        .from('posts')
        .select('*, user:profiles(*), my_likes:likes(*), likes(count)')
        // .eq('id', 6) 
        .eq('my_likes.user_id', user?.id)
        .order('created_at', {ascending: false});
        
        if (error) {
            alert('Something went wrong')
        }
        console.log(JSON.stringify(data))
        setNewPosts(data)
        setLoading(false);
    }

    return(

        <FlatList
            keyExtractor={(item) => item.id+1 || posts[0].id}
            data={[ ...newPosts]}
            renderItem={({ item }) => <PostListItem post={item}/>}
            contentContainerStyle={{ 
                gap: 10, 
                maxWidth: 512,
                alignSelf: "center", 
                width: "100%", 
            }}
            style={{ gap: 10 }}
            showsVerticalScrollIndicator={false}
        />

        // <View> 
        //     <PostListItem post={posts[0]} />
        //     <PostListItem post={posts[1]} />
        // </View>
    )
}
import { useWindowDimensions } from "react-native";
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
import { cld } from "~/src/lib/cloudinary";
import { ResizeMode, Video } from 'expo-av';
import { thumbnail, scale } from '@cloudinary/url-gen/actions/resize';

export default function PostContent({post}) {
    const { width } = useWindowDimensions();
    
    if(post.media_type === 'image' || post.image_url){
        const image = cld
        .image(post.image)
        .format('auto')
        .quality('auto')
        .resize(thumbnail().gravity(autoGravity()).width(width).height(width));
        return <AdvancedImage cldImg={image} className="w-full aspect-[4/3]" />
    }
    if(post.media_type === 'video'){
        const video = cld.video(post.image)
        video.resize(scale().width(600).height(600))
        
        return <Video
                className="w-52 aspect-[4/3] rounded-lg bg-slate-300"
                style={{ width: '75%', aspectRatio: 1 }}
                source={{
                    uri:video.toURL(),
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay
                />
    }
}
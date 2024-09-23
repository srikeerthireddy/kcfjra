
import React from "react";
import MyFollowingFeed from "../components/Feed/MyFollowingFeed";

import { useOutletContext } from "react-router-dom";

export default function MyFollowingPost() {
    const { newPost, updateNewPost } = useOutletContext()
    return (
        <>


            <MyFollowingFeed newPost={newPost} updateNewPost={updateNewPost}></MyFollowingFeed>
        </>


    )

}

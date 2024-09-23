
import React from "react";
import { Link } from "react-router-dom";
import LargeNav from "../components/headers/LargeNav/LargeNav"
import MobileNav from "../components/headers/MobileNav/MobileNav"
import Feed from "../components/Feed/Feed";
import TopNav from "../components/headers/TopNav/TopNav";
import { useOutletContext } from "react-router-dom";

export default function Home(){
    const {newPost,updateNewPost} = useOutletContext()
    return(
        <>
         
       
       <Feed newPost={newPost} updateNewPost={updateNewPost}></Feed>
        </>
       

    )
   
}

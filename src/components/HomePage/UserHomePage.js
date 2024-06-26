import Sidenav from "../basic/navigation/Sidenav";
import PostFeeds from "../posts/PostFeeds";
import { useState } from "react";
import CreatePostModal from "../posts/CreatePostModal";

export default function UserHomePage() {



    const [showPostModal, setShowPostModal] = useState(false);

    const openCreatePostModal = () => {
        setShowPostModal(true);
    }
    const closeCreatePostModal = () => {
        setShowPostModal(false);
    }

    return (
        <>
            <br /><br />
            <Sidenav openCreatePostModal={openCreatePostModal} />

            {
                showPostModal && <CreatePostModal closeCreatePostModal={closeCreatePostModal} />
            }
            <PostFeeds />


        </>

    );
}
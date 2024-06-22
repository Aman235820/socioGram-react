import Sidenav from "../navigation/Sidenav";
import Cookies from "js-cookie";
import PostFeeds from "../posts/PostFeeds";
import { useContext, useState } from "react";
import CreatePostModal from "../posts/CreatePostModal";
import AuthContext from "../../guards/AuthProvider";

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

            {showPostModal && <CreatePostModal
                closeCreatePostModal={closeCreatePostModal} />
            }
            <PostFeeds />


        </>

    );
}
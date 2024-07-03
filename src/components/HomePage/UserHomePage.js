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
            <div className="row">
                <div className="col-3 main-menu">
                    <Sidenav openCreatePostModal={openCreatePostModal} />
                </div>

                <div className="col-9">
                    {
                        showPostModal && <CreatePostModal closeCreatePostModal={closeCreatePostModal} />
                    }
                    <PostFeeds />
                </div>
            </div>
        </>

    );
}
import Sidenav from "../navigation/Sidenav";
import Cookies from "js-cookie";
import PostFeeds from "../posts/PostFeeds";

export default function UserHomePage() {



    const user = JSON.parse(Cookies.get('user'));


    return (
        <>
            <br /><br />
            <Sidenav />

            <PostFeeds/>

           
        </>

    );
}
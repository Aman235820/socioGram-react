import { useContext } from "react";
import { useSelector } from "react-redux";
import AuthContext from "../guards/AuthProvider";

export default function UserHomePage(){
    
    const {loggedInUserId} = useContext(AuthContext);

    const user = useSelector((state)=>
          (state.userDetails).userLoginCredentials[loggedInUserId]);

    //console.log("current user" , user);

    return(
        <>
        </>
     );
}
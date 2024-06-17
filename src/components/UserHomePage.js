import { useContext } from "react";
import { useSelector } from "react-redux";
import AuthContext from "../guards/AuthProvider";
import Sidenav from "./navigation/Sidenav";
import Cookies from "js-cookie";

export default function UserHomePage() {

    const user = JSON.parse(Cookies.get('user'));

    return (
        <>
            <br /><br />
            <Sidenav/>
        </>

    );
}
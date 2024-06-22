import React, { Children, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

export default function AuthGuard({ children }) {


    const { status , setStatus , setUser} = useContext(AuthContext)
    const navigate = useNavigate();
    
    useEffect(()=>{
        checkUser();
    },[children]);

    const userCredentials = useSelector((state)=>{
           return (state.userDetails).userLoginCredentials;
    });

    const checkUser = ()=>{
        const userCookie =  Cookies.get('user');
        try {
            if (userCookie) {
                const userDetails = JSON.parse(Cookies.get('user'));
                if(userCredentials.hasOwnProperty(userDetails.id)){
                    setStatus(true);
                    setUser(userDetails);
                    return;
                }
                else{
                 setStatus(false);
                }
            }
            else{
                 setStatus(false);
            }
            
            if (!status) {
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            navigate("/");
        }

    }
    
    return (
        <>
            {status ? <React.Fragment>{children}</React.Fragment> : <React.Fragment></React.Fragment>}
        </>
    );

}


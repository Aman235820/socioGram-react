import React, { Children, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

export default function AuthGuard({ children }) {


    const { status , setStatus} = useContext(AuthContext)
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
                if(userCredentials.hasOwnProperty(JSON.parse(Cookies.get('user')).id)){
                    setStatus(true);
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


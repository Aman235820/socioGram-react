import React, { Children, useContext, useEffect } from "react";
import AuthContext from "./AuthProvider";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({ children }) {


    const { status } = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(()=>{
           checkUser();
    },[children]);

    const checkUser = ()=>{
        try {
            if (!status) {
                navigate("/");
            }
        } catch (error) {
            navigate("/");
        }

    }
    
    return (
        <>
            {status ? <React.Fragment>{children}</React.Fragment> : <React.Fragment></React.Fragment>}
        </>
    );

}


import { useLocation } from "react-router-dom";
import CustomNavbar from "./navigation/CustomNavbar";
import { useEffect, useState } from "react";

export default function Base ({children}){
      
     const location = useLocation();

     const [myLocation , setMyLocation] = useState(null);

     useEffect(()=>{
           setMyLocation((location.pathname).replace(/^\//, ""));
     },[location]);

       return(
        <>
           <div className="social-media container-fluid p-0 m-0 bg-dark">
               <CustomNavbar myLocation = {myLocation}/>
               {children}
           </div>
        </>
       );

}
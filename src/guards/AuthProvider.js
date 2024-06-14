import { useState , createContext } from "react";

const AuthContext  = createContext();

export function AuthProvider({children}){

    const[status , setStatus] = useState(false);
    const [loggedInUserId , setLoggedInUserId] = useState(0);

    return(
        <AuthContext.Provider value = {{status , setStatus , loggedInUserId , setLoggedInUserId}}> 
            {children}
        </AuthContext.Provider>
    );

}

export default AuthContext;
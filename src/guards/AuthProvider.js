import { useState , createContext } from "react";

const AuthContext  = createContext();

export function AuthProvider({children}){

    const[status , setStatus] = useState(false);

    return(
        <AuthContext.Provider value = {{status , setStatus}}> 
            {children}
        </AuthContext.Provider>
    );

}

export default AuthContext;
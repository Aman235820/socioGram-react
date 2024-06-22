import { useState , createContext } from "react";

const AuthContext  = createContext();

export function AuthProvider({children}){

    const[status , setStatus] = useState(false);
    const [user , setUser] = useState({});

    return(
        <AuthContext.Provider value = {{status , setStatus , user , setUser}}> 
            {children}
        </AuthContext.Provider>
    );

}

export default AuthContext;
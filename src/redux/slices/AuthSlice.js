import { createSlice, current } from "@reduxjs/toolkit";


const authSlice = createSlice({

     name : "Authetication Data",
     initialState : {
        userLoginCredentials : {}   
     },
     reducers : {
          userLogin(state , action){
            const { id, ...credentials } = action.payload;                         //a type of js Map
            state.userLoginCredentials[id] = credentials;
            //console.log(current(state.userLoginCredentials))
          },
          userLogout(state){
              state.userLoginCredentials.clear();
          }
     }

});

export default authSlice.reducer;

export const {userLogin , userLogout} = authSlice.actions;
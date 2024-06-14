import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/AuthSlice";

const store = configureStore({
    reducer : {
          userDetails : authSlice
    }
});

store.subscribe(()=>{
     store.getState();
});

export default store;


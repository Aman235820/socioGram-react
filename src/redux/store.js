import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/AuthSlice";
import secureLocalStorage from "react-secure-storage";

const reduxSessionKey = 'YEGRFJHBVC';

const loadState = () => {
    try {
        const serializedState = secureLocalStorage.getItem(reduxSessionKey);
        if (serializedState == null || serializedState === 'undefined') {
            return undefined;
        }
        return JSON.parse(decodeURIComponent(serializedState));
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

const saveState = (state) => {
    try {
        let serializedState = encodeURIComponent(JSON.stringify(state));
        secureLocalStorage.setItem(reduxSessionKey, serializedState);
    } catch (e) {
        console.log(e);
    }
}

const preloadedState = loadState();

const store = configureStore({
    reducer: {
        userDetails: authSlice
    },
    preloadedState: preloadedState
});


store.subscribe(() => {
    saveState(store.getState());
});

export default store;


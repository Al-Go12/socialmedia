import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./slice";

export const store = configureStore({
    reducer: {
        authentication_user: authenticationReducer
    }
});

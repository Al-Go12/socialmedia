import { createSlice } from "@reduxjs/toolkit";

export const authenticationSlice = createSlice({
    name: 'authentication_user',
    initialState: {
        name: null,
        isAuthenticated: false,
        isAdmin: false,
       
        userProfile : {},
        notifications: [],
    },
    reducers: {

        set_Authentication: (state, action) => {
            state.name = action.payload.name;
            state.isAuthenticated = action.payload.isAuthenticated;
            state.isAdmin = action.payload.isAdmin;
        },
        updateUserProfile: (state,action) => {
            state.userProfile = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
        removeNotificationById: (state, action) => {
            const notificationIdToRemove = action.payload;
            state.notifications = state.notifications.filter(notification => notification.id !== notificationIdToRemove);
          },
    }
});

export const { set_Authentication,updateUserProfile,addNotification, clearNotifications } = authenticationSlice.actions;
export default authenticationSlice.reducer;

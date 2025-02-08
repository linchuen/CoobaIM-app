import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

type AuthState = {
    isSignedIn: boolean;
    user: {
        name?: string;
        email?: string;
        phone?: string;
    } | null;
};

type SignUpPayload = {
    name: string;
    email: string;
    phone: string;
    password: string;
};

type ResetPasswordPayload = {
    email: string;
    newPassword: string;
};

const initialState: AuthState = {
    isSignedIn: false,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signIn(state, action: PayloadAction<{ email: string; password: string }>) {
            // Example: Perform sign-in logic
            state.isSignedIn = true;
            state.user = { email: action.payload.email };
        },
        signOut(state) {
            state.isSignedIn = false;
            state.user = null;
        },
        signUp(state, action: PayloadAction<SignUpPayload>) {
            // Example: Perform sign-up logic
            state.isSignedIn = true;
            state.user = {
                name: action.payload.name,
                email: action.payload.email,
                phone: action.payload.phone,
            };
        },
        resetPassword(state, action: PayloadAction<ResetPasswordPayload>) {
            // Example: Perform password reset logic
            console.log("Password reset for:", action.payload.email);
        },
    },
});

// Selectors
export const selectIsSignedIn = (state: { auth: AuthState }) => state.auth.isSignedIn;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserName = createSelector(selectUser, (user) => user?.name);
export const selectUserEmail = createSelector(selectUser, (user) => user?.email);
export const selectUserPhone = createSelector(selectUser, (user) => user?.phone);

export const { signIn, signOut, signUp, resetPassword } = authSlice.actions;

export default authSlice.reducer;

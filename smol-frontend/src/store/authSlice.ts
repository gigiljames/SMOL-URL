import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

const initialToken = localStorage.getItem("smol_access_token");
const initialUserStr = localStorage.getItem("smol_user");

let parsedUser: User | null = null;
if (initialUserStr) {
  try {
    parsedUser = JSON.parse(initialUserStr);
  } catch {
    parsedUser = null;
  }
}

const initialState: AuthState = {
  user: parsedUser,
  accessToken: initialToken,
  isAuthenticated: Boolean(initialToken),
  isInitializing: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isInitializing = false;
      localStorage.setItem("smol_access_token", action.payload.accessToken);
      localStorage.setItem("smol_user", JSON.stringify(action.payload.user));
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      state.isInitializing = false;
      localStorage.setItem("smol_access_token", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
      localStorage.removeItem("smol_access_token");
      localStorage.removeItem("smol_user");
    },
    setInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
    },
  },
});

export const { setCredentials, updateAccessToken, logout, setInitializing } =
  authSlice.actions;

export default authSlice.reducer;

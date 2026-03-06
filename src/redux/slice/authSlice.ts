import { Partner, User } from "@/src/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthSlice {
  isAuthenticated: boolean;
  user: User | null;
  partner: Partner | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthSlice = {
  isAuthenticated: false,
  user: null,
  partner: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setPartner: (state, action: PayloadAction<Partner | null>) => {
      state.partner = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.partner = null;
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setError, setUser, setPartner, logout } =
  authSlice.actions;

export default authSlice.reducer;

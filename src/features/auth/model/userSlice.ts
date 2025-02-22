import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string | null;
  password: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: UserState = {
  email: localStorage.getItem("userEmail"),
  password: localStorage.getItem("userPassword"),
  isAuthenticated: !!localStorage.getItem("userEmail"),
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload;
      state.email = email;
      state.password = password;
      state.isAuthenticated = true;
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);
    },
    logout: (state) => {
      state.email = null;
      state.password = null;
      state.isAuthenticated = false;
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPassword");
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { login, logout, setError } = userSlice.actions;
export default userSlice.reducer;

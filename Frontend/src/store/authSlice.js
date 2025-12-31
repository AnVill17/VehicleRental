import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../backendFunctions/auth";



export const loginUser = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await authService.loginUser(email, password);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const res = await authService.registerUser(formData);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.userLogOut();
  } catch (error) {
    console.error("Logout error", error);
  }
});

export const checkAuthSession = createAsyncThunk("auth/checkSession", async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getCurrentUser();
    return res.data;
  } catch (error) {
    return rejectWithValue("No session");
  }
});



export const updateAccountDetails = createAsyncThunk("auth/updateDetails", async (details, { rejectWithValue }) => {
  try {
    const res = await authService.changeAccountDetails(details);
    return res.data; 
  } catch (error) {
    return rejectWithValue("Failed to update details");
  }
});

export const updateAvatar = createAsyncThunk("auth/updateAvatar", async (formData, { rejectWithValue }) => {
  try {
    const res = await authService.changeAvatar(formData);
    return res.data; 
  } catch (error) {
    return rejectWithValue("Failed to update avatar");
  }
});

// --- SLICE ---

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true, 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // Session Check
      .addCase(checkAuthSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(checkAuthSession.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })

      // Update Details (Immediate UI update)
      .addCase(updateAccountDetails.fulfilled, (state, action) => {
        state.user = action.payload; 
      })

      // Update Avatar (Immediate UI update)
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;
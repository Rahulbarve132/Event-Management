import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { API_URL } from "../config"
import socketService from "../services/socketService"

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      const { token, user } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await apiLogout()
  // Clear socket connection on logout
  socketService.disconnect()
})

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading"
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload.user
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(register.pending, (state) => {
        state.status = "loading"
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload.user
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.status = "idle"
        state.error = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      })
      .addCase(logout.rejected, (state) => {
        state.user = null
        state.status = "idle"
        state.error = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      })
  },
})

export default authSlice.reducer


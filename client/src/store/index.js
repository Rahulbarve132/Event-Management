import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import eventReducer from "./eventSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Export the base API URL for use throughout the app
export const API_URL = import.meta.env.VITE_API_URL || "https://event-management-857p.onrender.com"


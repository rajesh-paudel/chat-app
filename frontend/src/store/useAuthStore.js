import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const baseURL = "http://localhost:3000";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("error in checkauth", error);
      set({ authuser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data) => {
    try {
      set({ isSigningUp: true });

      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      toast.success("logged out successfully");
      set({ authUser: null });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  login: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      toast.success("login successfull");
      set({ authUser: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);

      toast.success("profile uploaded successfully");
      set({ authUser: res.data });
    } catch (error) {
      console.log("update profile error");
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  // connectSocket: () => {
  //   const { authUser } = get();
  //   if (!authUser || get().socket?.connected) return;
  //   const socket = io.connect(baseURL);
  //   set({ socket: socket });
  // },
  // disconnectSocket: () => {
  //   if (get().socket?.connected) get().socket.disconnect();
  // },
}));

import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: [],
  getUsers: async () => {
    try {
      const res = await axiosInstance.get("/messages/users");

      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  getMessages: async (userId) => {
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log(res);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),
  sendMessages: async (message) => {
    try {
      const { selectedUser, messages } = get();

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        message
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log(error);
      toast.error(error.response);
    }
  },
}));

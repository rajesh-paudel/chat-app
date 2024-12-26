import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
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
      if (userId) {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data });
      }
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
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (isMessageSentFromSelectedUser) return;
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));

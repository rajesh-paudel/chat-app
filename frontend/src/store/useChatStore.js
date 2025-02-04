import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  friends: [],
  friendRequests: [],
  selectedUser: null,
  getUsers: async () => {
    try {
      const res = await axiosInstance.get("/auth/users");

      set(() => ({ users: res.data }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getFriends: async () => {
    try {
      const res = await axiosInstance.get("/auth/getFriends");

      set({ friends: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  getFriendRequests: async () => {
    try {
      const res = await axiosInstance.get("/auth/getFriendRequests");

      set({ friendRequests: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  sendFriendRequest: async (userId) => {
    try {
      if (userId) {
        const res = await axiosInstance.get(
          `/auth/sendFriendRequest/${userId}`
        );
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  acceptFriendRequest: async (userId) => {
    try {
      const { friendRequests } = get();
      if (userId) {
        const res = await axiosInstance.get(
          `/auth/acceptFriendRequest/${userId}`
        );

        const newFriendRequests = friendRequests.filter(
          (req) => req._id !== userId
        );
        set(() => ({
          friendRequests: newFriendRequests,
        }));
        set((state) => ({
          friends: [...state.friends, userId],
        }));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  declineFriendRequest: async (userId) => {
    try {
      const { friendRequests } = get();
      if (userId) {
        const res = await axiosInstance.get(
          `/auth/declineFriendRequest/${userId}`
        );
        const newFriendRequests = friendRequests.filter(
          (req) => req._id !== userId
        );
        set(() => ({
          friendRequests: newFriendRequests,
        }));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  unfriend: async (userId) => {
    try {
      const { friends } = get();

      if (userId) {
        const res = await axiosInstance.get(`/auth/unfriend/${userId}`);
        const newFriends = friends.filter((frn) => frn._id !== userId);
        set(() => ({
          friends: newFriends,
        }));
        toast.success(res.data.message);
      }
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

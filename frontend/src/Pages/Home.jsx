import React from "react";
import { useChatStore } from "../store/useChatStore";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";

export default function Home() {
  const { selectedUser, authUser, getFriends, getFriendRequests } =
    useChatStore();
  useEffect(() => {
    getFriendRequests();
    getFriends();
  }, []);
  return (
    <div className="pb-3 bg-base-200">
      <div className="flex items-center justify-center pt-5 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </div>
  );
}

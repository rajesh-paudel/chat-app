import React from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
export default function ChatHeader() {
  const { selectedUser, serSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "avatar.png"}
                alt={selectedUser.name}
              ></img>
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser.name}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selecteduser._id) ? "online" : "offline"}
            </p>
          </div>
        </div>
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
}
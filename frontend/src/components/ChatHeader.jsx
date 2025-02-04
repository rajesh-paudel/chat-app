import React from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { Link } from "react-router-dom";
export default function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "avatar.png"}
                alt={selectedUser?.name}
              ></img>
            </div>
          </div>
          <div>
            <Link
              to={"/" + selectedUser?.name}
              state={{ user: selectedUser }}
              className="font-medium cursor-pointer"
            >
              {selectedUser?.name}
            </Link>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "online" : "offline"}
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

import React from "react";

import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
export default function Navbar() {
  const { authUser, logout } = useAuthStore();
  return (
    <div className="flex justify-between items-center px-10 py-1 mb-10">
      <div className="logo font-bold text-2xl">Chat-app</div>
      <div className="flex items-center gap-7">
        {authUser && (
          <div className="flex justify-between items-center gap-7">
            <Link
              to={"/profile"}
              className="font-bold flex  items-center gap-1"
            >
              <FaRegUser size={20} /> Profile
            </Link>
            <button
              onClick={logout}
              className="font-bold flex items-center gap-1"
            >
              <MdOutlineLogout size={20} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

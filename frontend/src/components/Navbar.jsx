import React from "react";
import { IoMdPersonAdd } from "react-icons/io";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";

import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

export default function Navbar() {
  const [searchText, setSearchText] = useState("");
  const [focused, setFocused] = useState(false);
  const { authUser, logout } = useAuthStore();
  const { users, sendFriendRequest } = useChatStore();
  const filteredUsers = users.filter((user) => user.name.includes(searchText));

  const sendRequest = (user) => {
    sendFriendRequest(user._id);
  };
  return (
    <div className="flex justify-between items-center px-10 py-1 mb-3">
      <Link to={"/"} className="logo font-bold text-2xl">
        Chat-app
      </Link>
      {authUser && (
        <div className="w-full max-w-md relative">
          <input
            type="text"
            list="userList"
            value={searchText}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                setFocused(false);
              }, 500);
            }}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full input input-bordered text-white mb-1"
            placeholder="Search people..."
          ></input>
          <div id="userList" className="absolute  w-full z-10">
            {filteredUsers.map((user, index) => {
              return (
                searchText &&
                focused && (
                  <div
                    key={index}
                    className=" cursor-pointer flex items-center justify-between w-full h-10 hover:bg-slate-600 bg-slate-700 text-white text:sm px-5 mb-0.5 py-2 rounded-md bg-"
                  >
                    <Link
                      onClick={() => {
                        setSearchText(user.name);
                      }}
                      to={"/" + user?.name}
                      state={{ user: user }}
                      className="flex flex-1  justify-start items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full">
                        <img
                          src={user.profilePic || "/avatar.png"}
                          className="w-full h-full rounded-full object-cover"
                        ></img>
                      </div>

                      <p>{user.name}</p>
                    </Link>
                    <div onClick={() => sendRequest(user)}>
                      <IoMdPersonAdd />
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}
      {authUser && (
        <div className="flex justify-between items-center">
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
        </div>
      )}
    </div>
  );
}

import { IoMdPersonAdd } from "react-icons/io";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

export default function Navbar() {
  const [searchText, setSearchText] = useState("");
  const [focused, setFocused] = useState(0);
  const [count, setCount] = useState(0);
  const { authUser, logout } = useAuthStore();
  const { users, sendFriendRequest, notifications } = useChatStore();
  const filteredUsers = users.filter((user) => user.name.includes(searchText));

  useEffect(() => {
    const countFn = () => {
      notifications?.forEach((notification) => {
        if (notification.isRead == false) {
          setCount(count + 1);
        }
      });
    };
    countFn();
  }, [notifications]);

  const sendRequest = (user) => {
    sendFriendRequest(user._id);
  };
  return (
    <div className="flex justify-between items-center px-10 py-1 mb-3">
      <Link
        to={"/"}
        className="logo font-bold sm:text-xl md:text-2xl mx-5 whitespace-nowrap"
      >
        Chat-app
      </Link>
      {authUser && (
        <div className="w-full sm:w-1/2 min-w-60  max-w-sm relative">
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
            className="w-full input input-bordered text-slate-600 mb-1 outline-none bg-purple-200 h-8 rounded-md px-3"
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
          <div className="flex justify-between items-center md:gap-7 gap-3">
            <Link
              onClick={() => setCount(0)}
              to="/notifications"
              className="relative"
            >
              <IoIosNotificationsOutline size={28} />
              {count.length && (
                <p
                  className={`  bg-red-500 rounded-full min-w-4 text-xs text-center  text-white absolute -right-2 -bottom-1`}
                >
                  {count}
                </p>
              )}
            </Link>
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

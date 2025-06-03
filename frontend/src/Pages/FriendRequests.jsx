import React from "react";

import { useChatStore } from "../store/useChatStore";
import { Link } from "react-router-dom";
const FriendRequests = () => {
  const { acceptFriendRequest, declineFriendRequest, friendRequests } =
    useChatStore();
  const acceptHandle = (userId) => {
    acceptFriendRequest(userId);
  };
  const declineHandle = (userId) => {
    declineFriendRequest(userId);
  };
  if (!friendRequests || friendRequests.length == 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center ">
        <h1 className="text-3xl font-white font-semibold ">
          No Friend Requests
        </h1>
      </div>
    );
  }
  return (
    <div className="flex max-w-3xl  flex-col mx-auto  ">
      <div className="w-full text-start cursor-pointer  text-white font-semibold sm:text-lg md:text-xl mb-3">
        Friend Requests
        <span className="text-gray-500 text-lg align-middle ml-1">
          {friendRequests.length}
        </span>
      </div>
      {friendRequests?.map((user, index) => {
        return (
          <div
            key={index}
            className=" w-full cursor-pointer flex items-center justify-between  h-15  bg-slate-700 text-white text:sm px-5  border-b-2 border-slate-400  py-2 "
          >
            <Link
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
            <button
              className=" outline-none p-2 w-20 rounded-md bg-green-500 mr-3"
              onClick={() => acceptHandle(user._id)}
              type="text"
            >
              Accept
            </button>
            <button
              className="outline-none p-2 w-20 rounded-md bg-red-500"
              onClick={() => declineHandle(user._id)}
              type="text"
            >
              Decline
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FriendRequests;

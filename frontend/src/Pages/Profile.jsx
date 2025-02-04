import React from "react";
import { Camera } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
export default function Profile({ user }) {
  const {
    authUser,

    isUpdatingProfile,
    updateProfile,
  } = useAuthStore();
  const { friends, friendRequests } = useChatStore();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image });
    };
  };
  return (
    <div className="w-full flex flex-col justify-center items-center gap-10 rounded">
      <div className=" w-1/3 bg-slate-900 p-5 flex flex-col items-center gap-2 rounded-md">
        <h1 className="text-3xl font-bold ">Profile</h1>
        <p> profile information</p>
        <div>
          <div className="relative">
            <img
              src={user?.profilePic || "/avatar.png"}
              alt="profile"
              className="rounded-full size-32 object-cover border-4"
            ></img>
            {authUser == user && (
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                ></input>
              </label>
            )}
          </div>
        </div>
        {authUser == user && (
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to upload your photo"}
          </p>
        )}
        <div className="w-full">
          Full Name
          <p className="w-full h-10 mt-1 mb-5 p-2 rounded-md bg-transparent border-stone-400 border-2">
            {user?.name}
          </p>
        </div>
        <div className="w-full mb-1">
          Email Address
          <p className="w-full h-10 rounded-md mt-1 p-2 bg-transparent border-stone-400 border-2">
            {user?.email}
          </p>
        </div>
        {authUser == user && (
          <Link
            to="/friendRequests"
            className="w-full text-start cursor-pointer  text-white font-semibold sm:text-lg md:text-xl"
          >
            Friend Requests
            <span className="text-gray-500 text-lg align-middle ml-1">
              {friendRequests.length}
            </span>
          </Link>
        )}

        <Link
          to="/friends"
          className="w-full text-start cursor-pointer text-white font-semibold sm:text-lg md:text-xl"
        >
          Friends
          <span className="text-gray-500 text-lg align-middle ml-1">
            {friends.length}
          </span>
        </Link>
      </div>
      <div className=" w-1/3 bg-slate-900 p-5 gap-8 flex flex-col items-start rounded-md">
        <h1 className="text-2xl font-bold">Account Information</h1>
        <div className=" w-full flex justify-between items-center pb-2 border-b-2">
          <p>Member since</p>
          <p>{user?.createdAt?.split("T")[0]}</p>
        </div>
        <div className="w-full flex justify-between items-center">
          <p>Account Status</p>
          <p className="text-green">Active</p>
        </div>
      </div>
    </div>
  );
}

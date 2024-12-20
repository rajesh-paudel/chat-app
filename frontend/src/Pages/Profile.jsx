import React from "react";
import { Camera } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
export default function Profile() {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
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
        <p>Yout profile information</p>
        <div>
          <div className="relative">
            <img
              src={authUser.profilePic || "/avatar.png"}
              alt="profile"
              className="rounded-full size-32 object-cover border-4"
            ></img>
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
          </div>
        </div>
        <p className="text-sm text-zinc-400">
          {isUpdatingProfile
            ? "Uploading..."
            : "Click the camera icon to upload your photo"}
        </p>
        <div className="w-full">
          Full Name
          <p className="w-full h-10 mt-1 mb-5 p-2 rounded-md bg-transparent border-stone-400 border-2">
            {authUser?.name}
          </p>
        </div>
        <div className="w-full">
          Email Address
          <p className="w-full h-10 rounded-md mt-1 p-2 bg-transparent border-stone-400 border-2">
            {authUser?.email}
          </p>
        </div>
      </div>
      <div className=" w-1/3 bg-slate-900 p-5 gap-8 flex flex-col items-start rounded-md">
        <h1 className="text-2xl font-bold">Account Information</h1>
        <div className=" w-full flex justify-between items-center pb-2 border-b-2">
          <p>Member since</p>
          <p>{authUser?.createdAt?.split("T")[0]}</p>
        </div>
        <div className="w-full flex justify-between items-center">
          <p>Account Status</p>
          <p className="text-green">Active</p>
        </div>
      </div>
    </div>
  );
}

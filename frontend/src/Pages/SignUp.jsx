import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
export default function SignUp() {
  const { signUp } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 character");
  };
  const onSubmit = (e) => {
    e.preventDefault();
    validateForm();
    signUp(formData);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <h1 className="text-2xl font-bold">Create Account</h1>
      <p>Get started with your free Account</p>
      <form className="flex flex-col gap-1" onSubmit={onSubmit}>
        Full Name
        <input
          className=" border-2 mb-5 border-stone-500 p-2 w-96 rounded-md bg-transparent"
          type="text"
          name="name"
          id="name"
          placeholder="Enter your Name"
          value={formData.name}
          onChange={onChange}
        ></input>
        Email
        <input
          className=" border-2 mb-5  border-stone-500 p-2 w-96 rounded-md bg-transparent"
          type="email"
          name="email"
          id="email"
          placeholder="Enter your Email"
          value={formData.email}
          onChange={onChange}
        ></input>
        Password
        <input
          className=" border-2 mb-5 border-stone-500 p-2 w-96 rounded-md bg-transparent"
          type="password"
          name="password"
          id="password"
          placeholder="Enter your Password"
          value={formData.password}
          onChange={onChange}
        ></input>
        <button
          type="Submit"
          className="bg-orange-300 p-2 rounded-md text-xl font-bold text-gray-900"
        >
          Create Account
        </button>
      </form>
      <p>
        Aready have an account ?
        <Link to="/login" className="text-bold text-orange-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}

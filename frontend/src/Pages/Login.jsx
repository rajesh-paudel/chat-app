import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 character");
      return false;
    }
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    //validate form
    if (validateForm()) {
      login(formData);
    }
  };
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-2">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p>Sign in to your account</p>
        <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
        <p>
          Don&apos;t have an account ?{" "}
          <Link to="/signUp" className="text-bold text-orange-300 ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

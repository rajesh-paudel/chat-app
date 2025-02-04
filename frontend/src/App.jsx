import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";

import Profile from "./Pages/Profile";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import FriendRequests from "./Pages/friendRequests";
import Friends from "./Pages/Friends";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  const location = useLocation();
  const user = location.state?.user;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <div className="p-5">
      <Navbar></Navbar>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        ></Route>

        <Route
          path="/profile"
          element={
            authUser ? <Profile user={authUser} /> : <Navigate to="/login" />
          }
        ></Route>
        <Route path="/:username" element={<Profile user={user} />}></Route>
        <Route
          path="*"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/friendRequests"
          element={authUser ? <FriendRequests /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/friends"
          element={authUser ? <Friends /> : <Navigate to="/login" />}
        ></Route>
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

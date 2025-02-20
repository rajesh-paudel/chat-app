import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

//user signup controller
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "fill up all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password length should be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    if (newUser) {
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profilePic: "/avatar.png",
      });
    } else {
      return res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

//user login controller

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "fill up all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "invalid email or password" });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.log("login error", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

//user logout controller
export const logout = async (req, res) => {
  try {
    res
      .cookie("jwt", "", {
        maxAge: 0,
      })
      .status(200)
      .json({ message: "logout successful" });
  } catch (error) {
    console.log("logout error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//update profile controller
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "profile pic is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("upload profile error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//controller to check user authentication while app loads
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("check auth error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

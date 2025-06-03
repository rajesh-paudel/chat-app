import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
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

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // Generate a verification token and expiry (24h from now)
    const emailToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours later

    newUser.verificationToken = emailToken;
    newUser.verificationTokenExpires = expires;

    if (newUser) {
      await newUser.save();
      // Send verification email with link containing token
      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Construct verification URL
      const verificationUrl = `http://localhost:5173/verify-email?token=${emailToken}`;

      // Send email
      await transporter.sendMail({
        from: `"chat app" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email",
        html: `Click here to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`,
      });
      res.status(201).json({
        message:
          "Signup successful! Please check your email to verify your account.",
      });
    } else {
      return res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
//email verification controller
export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    res.send("email verification successfull");
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
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
    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "email not verified please check you inbox to verify your account",
      });
    }

    generateToken(user._id, res);
    return res
      .status(200)
      .json({ user: { _id: user._id, name: user.name, email: user.email } });
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

//controller to return user
export const user = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate([
      "friends",
      "friendRequest",
    ]);
    res.status(200).json(user);
  } catch (error) {
    console.log("user info error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

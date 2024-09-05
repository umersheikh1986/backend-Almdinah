import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
export const test = (req, res) => {
  res.json({ message: "API is working..." });
};

export const register = async (req, res, next) => {
  const {
    email,
    ParentFirstName,
    ParentlastName,
    StreetAddress,
    City,
    PostalCode,
    PhoneNumber,
    StudentFirstName,
    StudentLastName,
    DOB,
    YearOfEntry,
    WouldYouLikeToEnroll,
  } = req.body;

  if (
    !email ||
    email == "" ||
    !ParentFirstName ||
    ParentFirstName === "" ||
    ParentlastName === "" ||
    !ParentlastName ||
    !StreetAddress ||
    StreetAddress == "" ||
    !City ||
    City == "" ||
    !PostalCode ||
    PostalCode == "" ||
    PhoneNumber == "" ||
    !PhoneNumber ||
    StudentFirstName == "" ||
    !StudentFirstName ||
    StudentLastName == "" ||
    !StudentLastName ||
    !DOB ||
    DOB == "" ||
    !YearOfEntry ||
    YearOfEntry == "" ||
    !WouldYouLikeToEnroll ||
    WouldYouLikeToEnroll == ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const newUser = new User({
    email,
    ParentFirstName,
    ParentlastName,
    StreetAddress,
    City,
    PostalCode,
    PhoneNumber,
    StudentFirstName,
    StudentLastName,
    DOB,
    YearOfEntry,
    WouldYouLikeToEnroll,
  });

  try {
    await newUser.save();
    res.json("Registration is Successful");
  } catch (error) {
    next(error);
  }
};
// update user

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username only contain letters and numbers")
      );
    }
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
// delete user
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to delete this account")
    );
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};
// signout user
export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("User has been sign out");
  } catch (error) {
    next(error);
  }
};
// get all Users
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const usersWithOutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      users: usersWithOutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
// get user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

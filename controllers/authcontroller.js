import User from "../models/User.js";
import createError from "../utils/createError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    // Validate username format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(req.body.username)) {
      return next(
        createError(
          400,
          "Username cannot be an email address. Please use a different username."
        )
      );
    }

    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        id: savedUser._id,
        isSeller: savedUser.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = savedUser._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(201)
      .send({ ...info, token });
  } catch (err) {
    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];

      if (field === "username") {
        return next(
          createError(
            400,
            `Username "${value}" is already taken. Please choose a different username.`
          )
        );
      } else if (field === "email") {
        return next(
          createError(
            400,
            `Email "${value}" is already registered. Please use a different email or try logging in.`
          )
        );
      } else {
        return next(createError(400, `${field} "${value}" already exists.`));
      }
    }
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send({ ...info, token });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return next(createError(404, "User not found!"));

    const { password, ...info } = user._doc;
    res.status(200).send(info);
  } catch (err) {
    next(err);
  }
};

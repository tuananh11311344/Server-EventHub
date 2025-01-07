const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandle = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_APP,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const getJsonWebToken = async (email, id) => {
  const payload = {
    email,
    id,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const handleSendMail = async (val, email) => {
  try {
    await transporter.sendMail({
      from: `Support EventHub Application <${process.env.EMAIL_APP}>`,
      to: email,
      subject: "Verification email code",
      text: "Your code to verification email",
      html: `<h1>${val}</h1>`,
    });
  } catch (error) {
    console.log("Can not send email ", error);
  }
};

const verification = asyncHandle(async (req, res) => {
  const { email } = req.body;
  const verificationCode = Math.round(1000 + Math.random() * 9000);
  try {
    await handleSendMail(verificationCode, email);
    res.status(200).json({
      message: "Send verification code successfully",
      data: verificationCode,
    });
  } catch (error) {
    res.status(401);
    throw new Error("Can not send notification email");
  }
});

const register = asyncHandle(async (req, res) => {
  const { email, password, fullname } = req.body;
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    res.status(401);
    throw new Error("User has already exist!!!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    email,
    fullname: fullname ?? "",
    password: hashPassword,
  });
  await newUser.save();

  res.status(200).json({
    mess: "Register new user success",
    data: {
      email: newUser.email,
      id: newUser.id,
      fullname: newUser.fullname,
      accessToken: await getJsonWebToken(email, newUser.id),
    },
  });
});

const login = asyncHandle(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await UserModel.findOne({ email });

  if (!existingUser) {
    res.status(403);
    throw new Error("User not found");
  }

  const isMatchPassword = await bcrypt.compare(password, existingUser.password);

  if (!isMatchPassword) {
    res.status(401);
    throw new Error("Email or Password is not correct!");
  }
  
  res.status(200).json({
    message: "Login successfully",
    data: {
      id: existingUser.id,
      fullname: existingUser.fullname,
      photoUrl: existingUser.photoUrl,
      email: existingUser.email,
      accessToken: await getJsonWebToken(email, existingUser.id),
    },
  });
});

const forgotPassword = asyncHandle(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(`${password}`, salt);

    await UserModel.findByIdAndUpdate(user._id, {
      password: hashPassword,
      isChangePassword: true,
    })
      .then(() => {
        res.status(200).json({
          mess: "Change password success",
        });
      })
      .catch((error) => {
        res.status(401);
        throw new Error("Can not change password", error);
      });
  } else {
    res.status(401);
    throw new Error("User not found !!!");
  }
});

const handleLoginWithGoogle = asyncHandle(async (req, res) => {
  const userInfo = req.body;

  const existingUser = await UserModel.findOne({ email: userInfo.email });
  let user = { ...userInfo };
  if (existingUser) {
    await UserModel.findByIdAndUpdate(existingUser.id, {
      ...userInfo,
      fullname: userInfo.name,
      photoUrl: userInfo.photo,
      updatedAt: Date.now(),
    });
    user.accessToken = await getJsonWebToken(userInfo.email, userInfo.id);
  } else {
    const newUser = new UserModel({
      fullname: userInfo.name,
      photoUrl: userInfo.photo,
      updatedAt: Date.now(),
      ...userInfo,
    });
    await newUser.save();
    user.accessToken = await getJsonWebToken(userInfo.email, newUser.id);
  }

  res.status(200).json({
    message: "Login with google successfully",
    data: user,
  });
});

module.exports = {
  register,
  login,
  verification,
  forgotPassword,
  handleLoginWithGoogle,
};

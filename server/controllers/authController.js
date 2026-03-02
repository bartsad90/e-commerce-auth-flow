const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
} = require("../utils");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const origin = 'http://localhost:5000'

const register = async (req, res) => {
  const { email, name, password } = req.body;
  

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    email,
    name,
    password,
    role,
    verificationToken,
  });

  //send verification token back only while testing postman!!!
  await sendVerificationEmail(name, email, verificationToken, origin);
  res
    .status(StatusCodes.CREATED)
    .json({
      msg: "Please check your email to verify your account",
      user: user.verificationToken,
    });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  if (!verificationToken || !email) {
    throw new CustomError.UnauthenticatedError(
      "Please provide a verification token and email",
    );
  }

  const user = await User.findOne({ email });

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError("Verification failed");
  }

  user.verificationToken = "";
  user.isVerified = true;
  user.verified = Date.now();

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Email verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your email");
  }

  //returns {name, userId, role} from user
  const tokenUser = createTokenUser(user);
  // create refresh token
  let refreshToken = '';
  //check for existing token
  const existingToken = await Token.findOne({user:user._id})


  if (existingToken) {
    const {isValid} = existingToken
    // for hardcoded banhammers in MongoDb
    if (!isValid) {
      throw new CustomError.UnauthenticatedError('Invalid credentials')
    }
    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user: tokenUser });
  // respond to avoid reading further code
    res.status(StatusCodes.OK).json({ user: tokenUser, refreshToken });
  }

  //create and attach a refreshToken if none exists in the db
  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers['user-agent']
  const ip = req.ip
  const userToken = {refreshToken, ip, userAgent, user:user._id }

  attachCookiesToResponse({ res, user: tokenUser });

  await Token.create(userToken)
  res.status(StatusCodes.OK).json({ user: tokenUser, refreshToken });
};

const logout = async (req, res) => {

  await Token.findOneAndDelete({user: req.user.userId})

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

const sendTestEmail = async (req, res) => {
  const email = "barteczek@example.com";
  const subject = "testing";
  const text = "testing";
  const html = "<b>testing</b>";
  let info = await sendEmail(email, subject, text, html);
  res.status(StatusCodes.OK).json({ info });
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  sendTestEmail,
};

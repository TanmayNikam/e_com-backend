const User = require("../model/user");
const jwt = require("jsonwebtoken");
const  expressJwt  = require("express-jwt");
const { ConnectionPoolClearedEvent } = require("mongodb");
const { errorHandler } = require("../helpers/dbErrorHandler.js");

exports.signup = (req, res) => {
  // console.log(req.body)
  const user = new User(req.body);
  try {
    user.save((err, data) => {
      if (err) {
        console.log(errorHandler(err));
        res.status(400).json({
          error: errorHandler(err),
        });
      } else {
        data.salt = undefined;
        data.hashed_password = undefined;
        res.json({
          message: "User saved",
          data,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "User with such credential doesn't exist !" });
    }

    // authenticate

    if (!user.authenticate(req.body.password)) {
      return res.status(401).json({ error: "Password doesn't match" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "successfully signed out !" });
  // res.redirect("/api");
};

exports.root = (req, res) => {
  res.send("welcome to root page");
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  const isUser = req.profile && req.auth && req.auth._id == req.profile._id;
  if (!isUser) {
    return res.status(403).json({
      error: "Access Denied !!! ",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resource! access denied !!! ",
    });
  }
  next();
};

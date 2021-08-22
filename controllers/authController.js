const User = require("../models/userModel");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken"); //to generate the sign token
const expressJwt = require("express-jwt"); //for authorization check

exports.register = (req, res) => {
  console.log("req.Body", req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

exports.login = (req, res) => {
  //find the user from mobile
  const { mobile, password } = req.body;
  User.findOne({ mobile }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that mobile no exist",
      });
    }

    //if user there match password and mobile
    //create auth method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Mobile and password does not match",
      });
    }
    //generate sign token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the token as t in cookie with expire date
    res.cookie("t", token, { expire: new Date() + 9999 });
    //return and response the user and the token to frontend

    const { _id, role, name, mobile } = user;
    return res.json({
      token,
      user: {
        _id,
        name,
        mobile,
        role,
      },
    });
  });
};

exports.logout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Log Out Success" });
};
exports.requireLogin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], 
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
      return res.status(403).json({
        error: "Access denied",
      });
    }
    next();
  };
  exports.isAdmin = (req, res, next) => {
    
    if (req.profile.role===0) {
      return res.status(403).json({
        error: "Admin only! Access denied",
      });
    }
    next();
  };

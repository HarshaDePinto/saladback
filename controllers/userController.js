const User = require("../models/userModel");

exports.read = (req, res) => {
  req.profile.salt = undefined;
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};
exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err || !user) {
        res.status(400).json({
          error: "User not found",
        });
      }
      user.salt = undefined;
      user.hashed_password = undefined;
      res.json(user);
    }
  );
};

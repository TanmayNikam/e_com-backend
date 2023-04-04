const User = require("../model/user");
const { Order, CartItem } = require("../model/order");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.userById = (req, res, next, id_val) => {
  User.findOne({ _id: id_val }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User not found !" });
    }
    req.profile = user;
    next();
  });
};

exports.handleGet = (req, res) => {
  // console.log(req.profile)
  res.status(200).json({
    data: req.profile,
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.json({
    user: req.profile,
  });
};

exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        updateUser: user,
      });
    }
  );
};

exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];
  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: item.count * item.price,
    });
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: "couldn't update user history",
        });
      }
      next();
    }
  );
};

exports.purchaseHistory = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .sort("-created")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(orders);
    });
};

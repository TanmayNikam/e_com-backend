const express = require("express");
const router = express.Router();
const {
  userById,
  handleGet,
  read,
  updateUser,
  purchaseHistory,
} = require("../controllers/user.js");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth.js");

router.param("userId", userById);

router.get("/user/secret/:userId", requireSignin, isAuth, isAdmin, handleGet);
router.get("/user/:userId", requireSignin, isAuth, read);
router.get("/orders/by/user/:userId", requireSignin, isAuth, purchaseHistory);

router.put("/user/:userId", requireSignin, isAuth, updateUser);

module.exports = router;

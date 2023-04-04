const express = require('express')
const router = express.Router();
const {requireSignin,isAuth}  = require("../controllers/auth.js")
const {userById} = require("../controllers/user.js")
const {getToken,processPayment} = require("../controllers/payment")

router.get("/payment/getToken/:userId",requireSignin,isAuth,getToken)
router.post("/payment/process/:userId",requireSignin,isAuth,processPayment)

router.param("userId",userById)

module.exports = router
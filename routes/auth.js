const express = require("express");
const router = express.Router();
const {root,signup,signin,signout,requireSignin} = require("../controllers/auth.js");
const {validateUser,checkValidationResult} = require("../validators/validUser.js")


router.get("/auth",root)
router.post("/auth/signup",validateUser('name'),validateUser('email'),validateUser('password'),checkValidationResult,signup);
router.post("/auth/signin",signin);
router.get("/auth/signout",signout)
router.get('/auth/page',requireSignin,(req,res)=>{
    res.send("atuhorized page! ")
})

module.exports = router; 
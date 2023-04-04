const express = require("express");
const router = express.Router();
const {create,categoryById,read,remove,update,readList} = require("../controllers/category.js")
const {requireSignin,isAuth,isAdmin}  = require("../controllers/auth.js")
const {userById} = require("../controllers/user.js")


router.param("userId",userById)
router.param("categoryId",categoryById)


router.get("/category/:categoryId",read)
router.get("/categories",readList)
router.put("/category/:userId/:categoryId",requireSignin,isAuth,isAdmin,update)
router.delete("/category/:userId/:categoryId",requireSignin,isAuth,isAdmin,remove)
router.post("/category/create/:userId",requireSignin,isAuth,isAdmin,create);


module.exports = router
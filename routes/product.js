const express = require("express");
const router = express.Router();
const {create} = require("../controllers/product.js")
const {requireSignin,isAuth,isAdmin}  = require("../controllers/auth.js")
const {userById} = require("../controllers/user.js")
const{productById,read,remove,update,listAll,relatedProducts,listCategories,listBySearch,getPhoto} = require("../controllers/product.js")


router.param("userId",userById)
router.param("productId",productById)

// get routes
router.get("/product/:productId",read)


router.get("/products",listAll)
router.get("/products/related/:productId",relatedProducts)
router.get("/products/categories",listCategories)
router.get("/product/photo/:productId",getPhoto)


// post routes
router.post("/product/create/:userId",requireSignin,isAuth,isAdmin,create);
router.post("/products/by/search", listBySearch);

//delete routes
router.delete("/product/:userId/:productId",requireSignin,isAuth,isAdmin,remove);

//put routes
router.put("/product/update/:userId/:productId",requireSignin,isAuth,isAdmin,update);


module.exports = router 
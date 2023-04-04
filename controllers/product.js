const mongoose = require("mongoose");
const fs = require("fs");
const _ = require("lodash");
const formidable = require("formidable");

const Product = require("../model/product.js");

exports.productById = (req, res, next, id_val) => {
  Product.findOne({ _id: id_val })
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({ error: "product not found !" });
      }
      req.product = product;
      next();
    });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  res.status(200).json({
    data: req.product,
  });
};

exports.create = (req, res) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image file not uploaded!",
      });
    }
    let product = new Product(fields);

    console.log(fields);
    // console.log(Object.keys(fields))
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "image size must be less than 1MB! ",
        });
      }
    }

    if (
      !fields.name ||
      !fields.description ||
      !fields.price ||
      !fields.category ||
      !fields.quantity ||
      !fields.shipping
    ) {
      return res.status(400).json({
        //require all fields
        error: "All fields are required!. Please fill the missing fields!",
      });
    }
    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.path); //saving photo to db
      product.photo.contentType = files.photo.type;
    }

    // product.photo = undefined
    product.save((err, data) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        data,
      });
    });
  });
};

exports.remove = async (req, res) => {
  const result = await Product.deleteOne({ _id: req.product._id });
  if (result.deletedCount === 1) {
    return res.status(204).json({
      message: "Successfully deleted the product.",
    });
  } else {
    return res.json(400).json({
      error: "No products matched the query",
    });
  }
};

exports.update = (req, res) => {
  console.log(req.product);
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "Image file not uploaded!",
        });
      }
      let product = _.extend(req.product, fields);
      console.log("product:", product);

      // if(!fields.name || !fields.description || !fields.price || !fields.category || !fields.quantity || !fields.shipping){
      //     return res.status(400).json({                                                                                                   //require all fields
      //         error : "All fields are required!. Please fill the missing fields!"
      //     })
      // }
      if (files.photo) {
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            error: "image size must be less than 1MB! ",
          });
        }
        product.photo.data = fs.readFileSync(files.photo.path); //saving photo to db
        product.photo.contentType = files.photo.type;
      }

      // product.photo = undefined
      product.save((err, data) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: err,
          });
        }
        res.json({
          data,
        });
      });
    });
};

exports.listAll = (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let order = req.query.order ? req.query.order : "asc";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.status(200).json({
        data,
      });
    });
};

exports.relatedProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 4;

  Product.find({
    _id: { $ne: req.product._id },
    category: req.product.category,
  })
    .select("-photo")
    .populate("category")
    .limit(limit)
    .exec((err, results) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.status(200).json({
        "#results": results.length,
        results,
      });
    });
};

exports.listCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.json(400).json({
        error: err,
      });
    }
    res.json({
      length: categories.length,
      categories,
    });
  });
};

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 6;
  let skip = parseInt(req.body.skip);
  let findArgs = {};
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.getPhoto = (req, res, next) => {
  // console.log(req.product)
  if (req.product.photo.data) {
    // console.log(req.product.photo.contentType)
    res.set("Content-Type", req.product.photo.contentType);
    res.send(req.product.photo.data);
  }
  next();
};

exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: "could not update product",
      });
    }
  });
  next();
};

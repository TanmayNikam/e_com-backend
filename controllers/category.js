const Category = require("../model/category")

exports.create = (req,res)=>{
    const category = new Category(req.body);
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({
                error : err
            })
        }
        res.json({
            data
        })
    })
}

exports.categoryById=(req,res,next,val)=>{
    Category.findOne({"_id":val},(err,category)=>{
        if(err || !category){
            return res.status(400).json({
                error: `${val} Category doesn't exist!`
            })
        }
        req.category = category
        next();
    })
}


exports.read=(req,res)=>{
    if(req.category)
        return res.status(200).json({
            data : req.category
        })
}


exports.remove= async (req,res)=>{
    const result = await Category.deleteOne({"_id":req.category._id})
    if (result.deletedCount === 1) {
        return res.status(204).json({
            message: "Successfully deleted the category."
        })
      } else {
          return res.json(400).json({
              error : "No categories matched the query"
          })
      }
}


exports.update=(req,res)=>{
    let category = req.category
    category.name = req.body.name

    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                error : err
            })
        }
        res.status(200).json({
            message: "successfully updated document!",
            category
        })
    })
}

exports.readList=(req,res)=>{
    Category.find((err,results)=>{
        if(err){
            return res.status(400).json({
                error : err
            })
        }
        res.status(200).json({ 
            message: results
        })
    })
}
const mongoose = require("mongoose")

const {ObjectId} = mongoose.Schema

const productSchema = new mongoose.Schema({ 
    name:{ 
        type: String,
        required : true,
        trim: true,
        maxLength : 32
    },
    description:{ 
        type: String,
        trim: true,
        maxLength :2000
    },
    price:{ 
        type: Number,
        required : true,
        trim: true
    },
    category:{ 
        type: ObjectId,
        required : true,
        ref: 'Category'
    },
    quantity:{ 
        type:Number
    },
    sold:{
        type: Number,
        default:0
    },
    photo:{
        data : Buffer,
        contentType : String
    },
    shipping:{
        required:false,
        type:Boolean
    }
},{
    timestamps:true
})


module.exports = mongoose.model("Product",productSchema)
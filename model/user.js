const mongoose = require('mongoose')
const crypto = require('crypto')
const uuid = require('uuid')


//userSchema
const userSchema = new mongoose.Schema({ 
    name:{ 
        type:String,
        required: true,
        trim:true,
        maxLength: 32
    },
    email:{ 
        type:String,
        required: true,
        trim:true,
        unique : true
    },
    hashed_password:{
        type:String,
        required: true
    },
    about: {
        type:String, 
        trim: true
    },
    salt: String,
    role:{ 
        type:Number,
        default:0
    },
    history: {
        type: Array,
        default:[]
    }
},{
    timestamps:true
})



//vitrualFields

userSchema.virtual('password').set(function(password){
    this._password = password
    this.salt = uuid.v1()
    this.hashed_password = this.encryptPassword(password)
}).get(function(){ 
    return this._password
})


userSchema.methods = {

    authenticate: function(pass){ 
        return this.encryptPassword(pass) === this.hashed_password;
    },
    encryptPassword: function(password){ 
        if(!password) return ''
        try{ 
            return crypto.createHmac('sha256',this.salt).update(password).digest('hex')
        }
        catch(err){
            console.log(err);
            return ''
        }
    }
}




module.exports = mongoose.model('User',userSchema);
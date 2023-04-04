require('dotenv').config()
const User = require('../model/user')
const Razorpay = require('razorpay')
const crypto = require("crypto")
const braintree=require("braintree")

const gateway = new braintree.BraintreeGateway({
    environment:braintree.Environment.Sandbox,
    merchantId: process.env.BT_MERCHANT_ID,
    publicKey:process.env.BT_PUBLIC_KEY,
    privateKey:process.env.BT_PRIVATE_KEY
})

exports.getToken=(req,res)=>{ 
    gateway.clientToken.generate({},(err,response)=>{ 
        if(err){ 
            return res.status(500).json({ 
                error: err
            })
        }
        return res.status(200).json({ 
            token:response
        })
    })
}


exports.processPayment=(req,res)=>{ 
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount
    
    let newTransaction = gateway.transaction.sale({
        amount:amountFromTheClient,
        paymentMethodNonce:nonceFromTheClient,
        options:{ 
            submitForSettlement: true
        }
    },(err,result)=>{ 
        if(err){
            res.status(500).json({
                error:err
            })
        }
        else{ 
            res.status(200).json({
                result:result
            })
        }
    })
}
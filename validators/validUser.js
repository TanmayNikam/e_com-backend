const { check, body, validationResult} = require('express-validator');

exports.validateUser = (route,next)=>{
    
    switch(route){ 
        case 'name' : return[   
            check("name")
            .notEmpty()
            .withMessage("Name must not be empty")
            .isLength({max :30})
            .withMessage("Name must be of length between 30") 
        ]
        break;
        case 'password' : return[ 
            check('password')
            .isLength(6)
            .withMessage("Password must have atleast 6 characaters")
            .matches(/\d/)
            .withMessage("Password must have atleast 1 Number")
        ]
        break;
        case 'email' : return[ 
            check('email')
            .isEmail()
            .withMessage("invalid format for email")
        ]
        break;
        default: return []
        break;
    }
}
exports.checkValidationResult=(req, res, next)=>{
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    else
    { 
        res.status(422).json({ 
            error : result.mapped()
        })
    }
}

    

    

    

        // try {
        //     validationResult(req).throw();
        //   } catch (err) {
        //     console.log(err.mapped());
          
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }


const express = require('express');
const router = express.Router();
const User = require('../module/User');
const bcrypt = require('bcryptjs');
const validateRegisterInput = require('../validation/registerValidation');

//@route get/api/auth
//@ desc teste de l'api auth 
//@acces  public 

router.get("/test", (req, res)=> {

    res.send('verification de la route si vous voyer ce message sache que la route marche bien');
});


//@route post/api/auth
//@ desc creér un nouvelle utilisateur
//@acces  public 
router.post("/register", async (req, res)=> {

    try{


        const { errors, isValid } = validateRegisterInput(req.body);

        if (!isValid) {
          return res.status(400).json(errors);
        }
    
 
 
     // verifier si  l'utilisateur existe
     const checkexitemail = await User.findOne({email:  new  RegExp( "^" +  req.body.email + "$" +"i   ") });
   
     
     if(checkexitemail) { 
         return res
         .status(400)
         .json({error: "email existe deja"});

     }
    
    // haspassword
    const hashedpassword= await bcrypt.hash(req.body.password , 12);
      
        // create a user 
        const newUser = new User({   
            email: req.body.email,
            password: hashedpassword,
            name: req.body.name ,
});

        // save user 
        const savedUser = await newUser.save();
        // return a new user
        return res.json(savedUser);

    }catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

module.exports = router;









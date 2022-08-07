
const express = require('express');
const router = express.Router();
const User = require('../module/User');
const bcrypt = require('bcryptjs');
const validateRegisterInput = require('../validation/registerValidation');
const jwt = require('jsonwebtoken');
const requiresAuth = require('../middleware/permission');


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

        // save user to the data base
        const savedUser = await newUser.save();
        const  userToReturn =  { ...savedUser._doc };
        delete userToReturn.password;
        // return a new user
        return res.json(userToReturn);

    }catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

//@route post/api/login
//@ desc login of user and return a assces token
//@acces  public 
router.post("/login", async (req, res) => {
    try {
      // check for the user
      const user = await User.findOne({
        email: new RegExp("^" + req.body.email + "$", "i"),
      });
  
      if (!user) {
        return res
          .status(400)
          .json({ error: "There was a problem with your login credentials" });
      }
  
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
  
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ error: "There was a problem with your login credentials" });
      }
  
      const payload = { userId: user._id };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.cookie("access-token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
  
      const userToReturn = { ...user._doc };
      delete userToReturn.password;
  
      return res.json({
        token: token,
        user: userToReturn,
      });
    } catch (err) { 
      console.log(err);
  
      return res.status(500).send(err.message);
    }
  });

  // @route   GET /api/auth/current
// @desc    Return the currently authed user
// @access  Private

 router.get("/current", requiresAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  return res.json(req.user);
});
  

// @route   GET /api/auth/current
// @desc    Return the currently authed user
// @access  Private
router.get("/current", requiresAuth, (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  return res.json(req.user);
});
// @route   PUT /api/auth/logout
// @desc    Logout user a clear the cookie
// @access  Private

router.put("/logout", requiresAuth, async (req, res) => {
  try {
    res.clearCookie("access-token");

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});




module.exports = router;









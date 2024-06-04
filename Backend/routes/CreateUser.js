const express = require("express");
const router = express.Router();
const User = require("../model/User");
const { body, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtsecret =  "suvidhafoundation";



router.post(
    "/createuser",
   [
      body("email").isEmail(),
      body("name").isLength({ min: 5 }),
      body("password", "Password must be at least 5 characters long").isLength({
        min: 5,
      }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { name, email, password,role } = req.body;
     
      try {
      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res
            .status(400)
            .json({ error: "Email address is already in use" });
        }
  
       
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        
        let userImageURL = null;
       
  
   
        await User.create({
          name,
          email,
          password: hashedPassword,
          role,
          userImage: userImageURL,
        });
        
        res.status(201).json({ success: true, message: "User created successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );


  router.post(
    "/loginuser",
    [
      body("email").isEmail(),
      body("password", "incorrect password").isLength({ min: 5 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const email = req.body.email;
  
      try {
        const userdata = await User.findOne({ email });
        if (!userdata) {
          return res
            .status(400)
            .json({ errors: "Try logging in with correct credentials" });
        }
        const pwdCompare = bcryptjs.compare(req.body.password, userdata.password);
  
        if (!pwdCompare) {
          return res
            .status(400)
            .json({ errors: "Try logging in with correct credentials" });
        }
        const data = { user: { id: userdata.id } };
    console.log(userdata.role);
  
        const authtoken = jwt.sign(data, jwtsecret);
  
        res.json({ success: true, authtoken});
      } catch (error) {
        console.log(error);
        res.json({ success: false });
      }
    }
  );



module.exports = router;
  
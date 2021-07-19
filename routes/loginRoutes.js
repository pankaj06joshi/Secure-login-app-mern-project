const routes = require("express").Router();
const LoginDetail = require("../src/models/loginSchema");
const bcrypt = require('bcryptjs');

routes.get("/", (req, res) => {
  res.render("login");
});

//for register a user....
routes.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    if (password === cpassword) {
      const RegisterUserDetails = new LoginDetail({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: password,
        cpassword: cpassword,
      });

      await RegisterUserDetails.generateAuthToken();

      // const token = await RegisterUserDetails.generateAuthToken();
      // console.log(`token part is : ${token}`);

      const result = await RegisterUserDetails.save();
      res.status(201).render("login");
    } else {
      res.send("password not match...");
    }
  } catch (error) {
    res.status(400).send("Error is : " + error);
  }
});

//for checking login credentials....
routes.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userDetails = await LoginDetail.findOne({email:email});
    const isMatched = await bcrypt.compare(password,userDetails.password);

     const token = await userDetails.generateAuthToken();
     console.log(`token is : ${token}`);


    if(isMatched){
        res.render('home');
    }else{
        res.send('Login Credentials are Wrong...') 
    }
  } catch (error) {
      console.log(error);
    res.status(400).send("Login Credentials are Wrong... ");
  }
});

module.exports = routes;

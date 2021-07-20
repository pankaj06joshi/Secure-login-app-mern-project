const routes = require("express").Router();
const LoginDetail = require("../src/models/loginSchema");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

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
      //we grab the token value here...
      const token = await RegisterUserDetails.generateAuthToken();
      // const token = await RegisterUserDetails.generateAuthToken();
      // console.log(`token part is : ${token}`);

      //save token on cookie..at registration time..
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 30000),
        httpOnly: true,
      });

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
    const userDetails = await LoginDetail.findOne({ email: email });
    const isMatched = await bcrypt.compare(password, userDetails.password);

    const token = await userDetails.generateAuthToken();
    //  console.log(`token is : ${token}`);

    //save token on cookie..at login time..
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 300000),
      httpOnly: true,
      // scecure:true property will work only when we have https connection
      //on development time we dnt have https connection so this property wont work
      //secure:true  // it provide security..
    });

    if (isMatched) {
      res.render("home");
    } else {
      res.send("Login Credentials are Wrong...");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Login Credentials are Wrong... ");
  }
});

routes.get("/secret", auth, (req, res) => {
  // console.log(`our token in cookie : ${req.cookies.jwt}`);
  res.render("secret");
});

routes.get("/logout", auth, async (req, res) => {
  try {
    // logout for single user...
    //delete current user token from database...
    // console.log(req.userDetails);
    // req.userDetails.tokens = req.userDetails.tokens.filter((item) => {
    //   return item.token !== req.token;
    // });

    //logout from all devices....
    req.userDetails.tokens = [];

    //clear current user token from cookie
    res.clearCookie("jwt");
    console.log("Logout successfull...");
    await req.userDetails.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = routes;

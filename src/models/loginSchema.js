const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// define schema for login details in mongodb...
const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid Email...");
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]
});

//generating token via JWT
loginSchema.methods.generateAuthToken = async function(){
  try {
    const token = jwt.sign({_id:this._id.toString()},process.env.SECRET);
    this.tokens = this.tokens.concat({token:token});
    await this.save(); 
    return token;

  } catch (error) {
    console.log("the error part is : " + error);
  }
}


//secure the password with hashing... and converting password into hash..
loginSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.cpassword = await bcrypt.hash(this.cpassword, 10);
  }
  next();
});

//create loginDetails Collection for database
const LoginDetail = new mongoose.model("LoginDetail", loginSchema);




module.exports = LoginDetail;

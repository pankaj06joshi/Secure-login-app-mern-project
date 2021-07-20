const jwt = require('jsonwebtoken');
const LoginDetails = require("../src/models/loginSchema");


const auth = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
        const userVerification = jwt.verify(token,process.env.SECRET);
        // console.log(userVerification);

        const userDetails = await LoginDetails.findOne({_id:userVerification._id});
        // console.log(userDetails);
        
        req.token = token;
        req.userDetails = userDetails;
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;
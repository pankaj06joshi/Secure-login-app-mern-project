require('dotenv').config();
const express = require("express");
const app = express();
require("./db/dbConnection");
const hbs = require('hbs');
const path = require('path');
const PORT = process.env.PORT || 8000;
const loginRouters = require('../routes/loginRoutes');
const cookieParser = require('cookie-parser'); 

const staticPath = path.join(__dirname,"../public");
const viewsPath = path.join(__dirname,"../templates/views");
const partialPath = path.join(__dirname,"../templates/partials");

app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(staticPath));
app.use(loginRouters);

app.set('view engine','hbs');
app.set('views',viewsPath);

hbs.registerPartials(partialPath);




app.listen(PORT,()=>{
    console.log(`server started at port : ${PORT}`);
})
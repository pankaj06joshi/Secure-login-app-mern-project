const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/logindb",
{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false })
.then(()=>console.log("Connection Successfull...."))
.catch((e)=>console.log("Connection Failed...")) 
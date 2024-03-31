const express = require("express");
const mongoose = require('mongoose');
const { mongoURL } = require("./config");
const app = express();
const port =3000;
const cors= require('cors');
const { User } = require("./db");
const v1Router = require('./Routes/index');
mongoose.connect(mongoURL);
app.use(cors());
app.use(express.json())

app.use('/api/v1',v1Router);

app.get('/',async (req,res)=>{
    res.json({msg:'this is home route'});
})
app.listen(port,()=>{
    console.log('The server is listening on the port : '+port);
})


 
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectToDB = require('./db/mongodb');
const userRouter = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const app = express();
app.use(express.json());


app.use("/ping",(req,res)=>{
   res.json({"status":"Alive!"});
});


app.use("/api/auth",userRouter);

app.use("/api/inventory",inventoryRoutes);
connectToDB().then(()=>{
  console.log("mongodb connnected!!");
  app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`);    
  });  
}).catch((err)=>{
  console.log(err);  
});


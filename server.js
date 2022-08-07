
require('dotenv').config();
const express = require('express');
const { Server } = require('https');
const { default: mongoose} = require('mongoose');
const cookieParser =require('cookie-parser');




// importation de route
const authroute= require('./route/auth');
const Agendasroute= require('./route/agendas');



  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(cookieParser());
 
  app.get('/api', (req, res) => {
res.send("entretien agenda");

 });

  app.use("/api/auth", authroute);
  app.use('/api/agendas', Agendasroute);
  



 
  



 
  mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  }); 

  


  


   
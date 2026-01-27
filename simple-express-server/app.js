//Require statements
const express = require("express");

//create an express application
const app = express();

//define the middlewear configs
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//define the port number
const port = process.env.PORT || 3000;

//define the routes
app.get("/", (req, res, next) => {
  res.send("Hellow World!");
});

//start the server
app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
});
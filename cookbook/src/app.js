/*
Name: Shannon Kueneke
Date: January 27, 2026
File: src/app.js
Description: Cookbook App
*/

const express = require('express');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const recipes = require("../database/recipes");
const users = require("../database/users");
const Ajv = require("ajv");

//create an express app
const app = express();

//create new Ajv instance
const ajv = new Ajv();

//Ajv JSON schedule object for validating password req body against
const securityQuestionSchema = {
  type: "object",
  properties: {
    newPassword: { type: "string" },
    securityQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          answer: { type: "string" }
        },
        required: ["answer"],
        additionalProperties: false
      }
    }
  },
  required: ["newPassword", "securityQuestions"],
  additionalProperties: false
};

//parse incoming req as json payloads
app.use(express.json());
//parse incoming urlencoded payloads
app.use(express.urlencoded({extended:true}));

app.get("/", async(req, res, next)=> {
  //next(createError(501));
  //HTML content for the landing page
  const html = `
    <html>
      <head>
        <title>Cookbook App</title>
        <style>
          body, h1, h2, h3 {margin:0; padding:0; border:0;}
          body {
            background:#424242;
            color:#fff;
            margin:1.25em;
            font-size:1.25em;
          }
          h1, h2, h3 {color: #ef5350; font-family:'Emblema One', cursive;}
          h1, h2 {text-align:center;}
          h3 {color: #fff;}
          .container {width:50%; margin:0 auto; font-family:'Lora', serif;}
          .recipe {border:1px solid #ef5350; padding:1rem; margin:1rem 0;}
          .recipe h3 {margin-top:0;}
          main a {color: #fff; text-decoration:none;}
          main a:hover {color: #ef5350; text-decoration:underline;}
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Cookbook App</h1>
            <h2>Discover and Share Amazing Recipes</h2>
          </header>
          <br/>
          <main>
            <div class="recipe">
              <h3>Classic Beef Tacos</h3>
              <p>1.Brown the ground beef in a skillet.<br>2. Wrm the taco shells in the oven.<br>3.Fill the taco shells with beef, lettuce, and cheese.</p>
            </div>
            <div class="recipe">
              <h3>Vegetarian Lasagna</h3>
              <p>1. Layer lasagna noodles, marinara sauce, and cheese in a baking dish.<br>2. Bake at 375 degrees for 45 minutes.<br>3. Let cool before serving.</p>
            </div>
          </main>
        </div>
      </body>
    </html>
  `; //end HTML content for the landing page

  res.send(html); //sends the html content to the client
});

//GET endpoint for /api/recipes (all recipes)
app.get("/api/recipes", async(req, res, next)=> {
  try {
    const allRecipes = await recipes.find();
    console.log("All recipes: ", allRecipes); //logs all recipes
    res.send(allRecipes); //sends response with all recipes
  } catch(err) {
    console.error("Error: ", err.message); //logs error msg
    next(err); //passes error to the next middleware
  }
});

//GET endpoint for /api/recipes/:id (single recipe by id)
app.get("/api/recipes/:id", async(req, res, next)=> {
  try {
    //check if id is a number
    let { id } = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }

    const recipe = await recipes.findOne({id: Number(req.params.id)});
    console.log("Recipe: ", recipe);
    res.send(recipe);
  } catch(err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

//POST endpoint for /api/recipes (adding a new recipe)
app.post("/api/recipes", async(req, res, next)=> {
  try {
    const newRecipe = req.body;

    const expectedKeys = ["id", "name", "ingredients"];
    const receivedKeys = Object.keys(newRecipe);

    if(!receivedKeys.every(key=> expectedKeys.includes(key))|| receivedKeys.length !== expectedKeys.length) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }

    const result = await recipes.insertOne(newRecipe);
    console.log("Result: ", result);

    res.status(201).send({id: result.ops[0].id});
  } catch(err) {
    console.error("Error: ", err.message());
    next(err);
  }
});

//POST endpoint for /api/register
app.post("/api/register", async(req, res, next)=> {
  console.log("Request body: ", req.body);

  try {
    //const { email, password } = req.body;
    const user = req.body;

    const expectedKeys = ["email", "password"];
    const receivedKeys = Object.keys(user);

    if (!receivedKeys.every(key=>expectedKeys.includes(key)) ||
      receivedKeys.length !== expectedKeys.length) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }


    let duplicateUser;
    try {
      duplicateUser = await users.findOne({email: user.email});
    } catch(err) {
      duplicateUser = null;
    }

    if (duplicateUser) {
      console.error("Conflict: User already exists");
      return next(createError(409, "Conflict"));
    }

    const hashedPassword = bcrypt.hashSync(user.password, 10);

    const newUser = await users.insertOne({
      email: user.email,
      password: hashedPassword
    });

    res.status(200).send({user: newUser, message: "Registration successful"});
  } catch(err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

//POST endpoint for /api/users/:email/password-reset
app.post("/api/users/:email/reset-password", async(req, res, next)=> {
  try {
    const { email } = req.params;
    const { newPassword, securityQuestions } = req.body;

    const validate = ajv.compile(securityQuestionSchema);
    const valid = validate(req.body);

    if (!valid) {
      console.error("Bad Request: Invalid request body", validate.errors);
      return next(createError(400, "Bad Request"));
    }

    const user = await users.findOne({email: email});

    if (securityQuestions[0].answer !== user.securityQuestions[0].answer ||
      securityQuestions[1].answer !== user.securityQuestions[1].answer ||
      securityQuestions[2].answer !== user.securityQuestions[2].answer
    ) {
      console.error("Unauthorized: Security questions answers do not match");
      return next(createError(401, "Unauthorized"));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;

    const result = await users.updateOne({email: email}, {user});

    console.log("Result: ", result);
    res.status(200).send({message: "Password reset successful"})
  } catch(err) {
    console.error("Error: ", err.message);
    next(err);
  }
});

//DELETE endpoint for /api/recipes/:id
app.delete("/api/recipes/:id", async (req, res, next)=> {
  try {
    const { id } = req.params;
    const result = await recipes.deleteOne({id: parseInt(id) });
    console.log("Result: ", result);
    res.status(204).send();
  } catch (err) {
    if (err.message === "No matching item found") {
      return next(createError(404, "Recipe not found"));
    }

    console.error("Error: ", err.message);
    next(err);
  }
});

//PUT endpoint for /api/recipes/:id
app.put("/api/recipes/:id", async(req, res, next)=> {
  try {
    let { id } = req.params;
    let recipe = req.body;
    id = parseInt(id);

    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }

    const expectedKeys = ["name", "ingredients"];
    const receivedKeys = Object.keys(recipe);

    if (!receivedKeys.every(key=> expectedKeys.includes(key)) || receivedKeys.length !== expectedKeys.length) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }

    const result = await recipes.updateOne({id: id}, recipe);
    console.log("Result", result);
    res.status(204).send();
  } catch(err) {
    if (err.message === "No matching item found") {
      console.log("Recipe not found", err.message);
      return next(createError(404, "Recipe not found"));
    }
    console.error("Error", err.message);
    next(err);
  }
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  res.json({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  });
});

module.exports = app;


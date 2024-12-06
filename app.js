const dotenv = require("dotenv");
dotenv.config();

//fonction d'importation d'express
const express = require("express");
const cors = require('cors');

const mongoose = require("mongoose");

//constante app qui va appeler la méthode express
const app = express();

app.use(express.json());
app.use('/images', express.static('images'));

const booksRoutes = require("../backend/routes/books");
const usersRoutes = require("./routes/users");
const User = require("./models/Users");
const Book = require("./models/Books");

mongoose
  .connect("mongodb+srv://saaraahdahmani:Fvz_86dzuRPdXF7@cluster0.wplqs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée :/ !"));

app.use(cors())

app.use('/api/books', booksRoutes);
app.use('/api/auth', usersRoutes);

//exporter l'app pour pouvoir utiliser sur les autres fichiers
module.exports = app;
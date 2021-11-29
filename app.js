var express = require("express");
var logger = require("morgan");

var authsRouter = require("./routes/auths");
var pokemonRouter = require("./routes/pokemons")

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auths", authsRouter);
app.use("/pokemons", pokemonRouter);

module.exports = app;

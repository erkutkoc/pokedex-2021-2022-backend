"use strict";

var express = require("express");
const { Pokemon } = require("../model/pokemons");
const { Users } = require("../model/users");
const router = require("./auths");
const { authorize } = require("../utils/authorize");

const UserModel = new Users();
const PokemonModel = new Pokemon();
//const {authorizeFromCookie} = require("../utils/authorize");
/**
 * all : GET /pokemons
 */
router.get("/", function (req, res) {
  console.log("GET /pokemons");
  return res.json(PokemonModel.getAll());
});
/**
 * name : GET /pokemons/name/{name}
 */
router.get("/name/:name", function (req, res) {
  const name = req.params.name;
  console.log("GET /pokemons/name/" + name);
  const pokemon = PokemonModel.getByName(name);
  if (!pokemon) return res.status(404).end();
  return res.json(pokemon);
});
/**
 * id : GET /pokemons/id/{id}
 */
router.get("/id/:id", function (req, res) {
  const id = req.params.id;
  console.log("GET /pokemons/id/" + id);
  const pokemon = PokemonModel.getById(id);
  if (!pokemon) return res.status(404).end();
  return res.json(pokemon);
});
/**
 * random : GET /pokemons/random + ADD to user collection
 */
router.put("/random/:number/:id", authorize, function (req, res) {
  console.log("GET /pokemons/random");
  var userId = req.params.id;
  var number = req.params.number;
  let pokemon = new Array(number);
  for (let index = 0; index < number; index++) {
    pokemon[index] = PokemonModel.getOneRandom();
    UserModel.addPokemonInUserCollection(userId, pokemon[index].id);
  }
  if (!pokemon) return res.status(404).end();
  return res.json(pokemon);
});
/**
 * all sort : GET /pokemons/sort/{sortValue}
 */
router.get("/sort/:filter/:value", function (req, res) {
  var filter = req.params.filter;
  var value = req.params.value;
  return res.json(PokemonModel.getAllSorted(filter, value));
});

/**
 * add pokemon in user collection
 */
router.post("/user/:userId/:pokemonId", function (req, res) {
  const userId = req.params.userId;
  const pokemonId = req.params.pokemonId;
  return res.json(Users.addPokemonInUserCollection(userId, pokemonId));
});

module.exports = router;

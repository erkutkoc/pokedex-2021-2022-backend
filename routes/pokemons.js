"use strict";
var express = require("express");
const {Pokemon} = require("../model/pokemons");
const {Users} = require("../model/users");
const router = require("./auths");
const PokemonModel = new Pokemon();
//const {authorizeFromCookie} = require("../utils/authorize");
/**
 * all : GET /pokemons
 */
router.get("/", function(req, res){
    console.log("GET /pokemons");
    return res.json(PokemonModel.getAll());
});
/**
 * name : GET /pokemons/name/{name}
 */
router.get("/name/:name", function(req, res){
    const name = req.params.name;
    console.log("GET /pokemons/name/"+name);
    const pokemon = PokemonModel.getByName(name);
    if(!pokemon) return res.status(404).end();
    return res.json(pokemon);
});
/**
 * id : GET /pokemons/id/{id}
 */
router.get("/id/:id", function(req, res){
    const id = req.params.id;
    console.log("GET /pokemons/id/"+id);
    const pokemon = PokemonModel.getById(id);
    if(!pokemon) return res.status(404).end();
    return res.json(pokemon);
});
/**
 * random : GET /pokemons/random
 */
 router.get("/random", function(req, res){
    console.log("GET /pokemons/random");
    const pokemon = PokemonModel.getOneRandom();
    if(!pokemon) return res.status(404).end();
    return res.json(pokemon);
});
/**
 * all sort : GET /pokemons/sort/{sortValue}
 */
 router.get("/sort/:filter/:value", function(req, res){

    var filter = req.params.filter;
    var value = req.params.value;
    return res.json(PokemonModel.getAllSorted(filter,value));
});

/**
 * add pokemon in user collection
 */
router.post("/user/:userId/:pokemonId", function(req, res){
    const userId = req.params.userId;
    const pokemonId = req.params.pokemonId;
    return res.json(Users.addPokemonInUserCollection(userId, pokemonId));
});

module.exports = router;
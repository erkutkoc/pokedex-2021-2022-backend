"use strict";
var express = require("express");
var router = express.Router();
const {Pokemon} = require("../model/pokemons");
const {Users} = require("../model/users");
const { authorize } = require("../utils/authorize");

const PokemonModel = new Pokemon();
const UserModel = new Users();
//const {authorizeFromCookie} = require("../utils/authorize");
/**
 * all : GET /all users
 */
router.get("/collection/:userId", function(req, res){
    console.log(req.params.userId);
    const collection = UserModel.getAllPokemonByUserCollection(req.params.userId);
    return res.json(collection);
});
/**
 * name : GET /pokemons/name/{name}
 */
router.post("/collection",authorize, function(req, res){
    console.log("POST collection {user, pokemon} {"+req.body.user+","+ req.body.pokemon+"}");
    const collection = UserModel.addPokemonInUserCollection(req.body.user, req.body.pokemon);
    return res.json(collection);
});

module.exports = router;
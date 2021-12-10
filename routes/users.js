"use strict";
var express = require("express");
var router = express.Router();
const {Pokemon} = require("../model/pokemons");
const {Users} = require("../model/users");

const PokemonModel = new Pokemon();
const UserModel = new Users();
const {authorizeFromCookie, authorize} = require("../utils/authorize");
/**
 * all : GET /all users
 */
router.get("/collection/:userId", function(req, res){
    console.log(req.params.userId);
    const collection = UserModel.getAllPokemonByUserCollection(req.params.userId);
    return res.json(collection);
});
/**
 * name : POST /pokemons/name/{name}
 */
router.post("/collection", function(req, res){
    console.log("POST collection {user, pokemon} {"+req.body.user+","+ req.body.pokemon+"}");
    const collection = UserModel.addPokemonInUserCollection(req.body.user, req.body.pokemon);
    return res.json(collection);
});

/**
 * GET /{userId}"
 */
router.get("/:userId",authorize, function(req, res){

    const user = UserModel.getOne(req.params.userId);
    return res.json(user);
});

module.exports = router;
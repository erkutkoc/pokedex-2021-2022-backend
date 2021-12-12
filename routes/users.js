"use strict";
var express = require("express");
var router = express.Router();
const { Pokemon } = require("../model/pokemons");
const { Users } = require("../model/users");

const PokemonModel = new Pokemon();
const UserModel = new Users();
const { authorizeFromCookie, authorize } = require("../utils/authorize");
/**
 * all : GET /all users
 */
router.get("/collection/:userId", function (req, res) {
  console.log(req.params.userId);
  const collection = UserModel.getAllPokemonByUserCollection(req.params.userId);
  return res.json(collection);
});
/**
 * name : POST /pokemons/name/{name}
 */
router.post("/collection", authorize, function (req, res) {
  console.log(
    "POST collection {user, pokemon} {" +
      req.body.user +
      "," +
      req.body.pokemon +
      "}"
  );
  const collection = UserModel.addPokemonInUserCollection(
    req.body.user,
    req.body.pokemon
  );
  return res.json(collection);
});

/**
 * GET /{userId}"
 */
router.get("/:userId", authorize, function (req, res) {
  const user = UserModel.getOne(req.params.userId);
  return res.json(user);
});

// Update a user : PUT /api/users/:userId
router.put("/:userId", authorize, async function (req, res) {
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("currentPassword") && req.body.currentPassword.length === 0) ||
    (req.body.hasOwnProperty("newPassword") && req.body.newPassword.length === 0) 
    //(req.body.hasOwnProperty("newPasswordCheck") && req.body.newPasswordCheck.length === 0)
  )
    return res.status(400).end();

  const userUpdated = await UserModel.updateOneUser(req.params.userId, req.body);
  if (!userUpdated) return res.status(404).end();
  return res.json(userUpdated);
});

module.exports = router;

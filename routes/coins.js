"use strict";
let express = require("express");
const { authorize } = require("../utils/authorize");
let router = express.Router();
const { Users } = require("../model/users");
const userModel = new Users();

// Update a user's coins : PUT /api/coins/:id
router.put("/:id", authorize, function (req, res) {
  if (
    !req.body ||
    (req.body.hasOwnProperty("coins") && req.body.coins.length === 0)
  )
    return res.status(400).end();

  const userUpdated = userModel.updateUserCoins(req.params.id, req.body.coins);
  console.log("userUpdated : " + userUpdated);
  if (!userUpdated) return res.status(404).end();
  return res.json(userUpdated);
});

module.exports = router;

"use strict";
let express = require("express");
//const { authorize } = require("../utils/authorize");
let router = express.Router();
const { Users } = require("../model/users");
const userModel = new Users();

// Update a user's coins : PUT /api/coins/:id
router.put("/:id", function (req, res) {
    const userUpdated = userModel.updateOne(req.params.id, req.body);
    if (!userUpdated) return res.status(404).end();
    return res.json(userUpdated);
  });


module.exports = router;
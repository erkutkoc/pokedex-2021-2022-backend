var express = require("express");
var router = express.Router();
const { Users } = require("../model/users");
const userModel = new Users();
//const test ;
/* Register a user : POST /auths/register */
router.post("/register", async function (req, res, next) {
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("email") && req.body.email.length === 0) ||
    (req.body.hasOwnProperty("pseudo") && req.body.pseudo.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.register(
    req.body.email,
    req.body.pseudo,
    req.body.password
  );
  // Error code '409 Conflict' if the email already exists
  if (!authenticatedUser) return res.status(409).end();

  return res.json(authenticatedUser);
});

/* login a user : POST /auths/login */
router.post("/login", async function (req, res, next) {
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body ||
    (req.body.hasOwnProperty("email") && req.body.email.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)
  )
    return res.status(400).end();

  const authenticatedUser = await userModel.login(
    req.body.email,
    req.body.password
  );
  // Error code '401 Unauthorized' if the user could not be authenticated
  if (!authenticatedUser) return res.status(401).end();

  return res.json(authenticatedUser);
});


module.exports = router;

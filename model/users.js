"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const {
  parse,
  serialize
} = require("../utils/json");
var escape = require("escape-html");
const jwtSecret = "ilovepokemon!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // in ms : 24 * 60 * 60 * 1000 = 24h

const jsonDbPath = __dirname + "/../data/users.json";
const jsonPokemonDbPath = __dirname + "/../data/pokemons.json";
const jsonCoinsHistoryForUserDbPath = __dirname + "/../data/coinsHistoryForUser.json";

const saltRounds = 10;

// Default data -- mdp = 'admin'
const defaultItems = [{
  id: 1,
  email: "admin@test.be",
  pseudo: "admin",
  password: "$2b$10$RqcgWQT/Irt9MQC8UfHmjuGCrQkQNeNcU6UtZURdSB/fyt6bMWARa",
  coins: 0,
  "collections": [4, 2, 3]
}, ];
// hash default password
/*
bcrypt.hash(defaultItems[0].password, saltRounds).then((hashedPassword) => {
  defaultItems[0].password = hashedPassword;
  console.log("Hash of default password:", hashedPassword);
});
*/

class Users {
  constructor(dbPath = jsonDbPath, users = defaultItems) {
    this.jsonDbPath = dbPath;
    this.defaultItems = users;
  }

  getNextId() {
    const users = parse(this.jsonDbPath, this.defaultItems);
    let nextId;
    if (users.length === 0) nextId = 1;
    else nextId = users[users.length - 1].id + 1;

    return nextId;
  }

  /**
   * Returns all users
   * @returns {Array} Array of users
   */
  getAll() {
    const users = parse(this.jsonDbPath, this.defaultItems);
    return users;
  }

  /**
   * Returns the user identified by id
   * @param {number} id - id of the user to find
   * @returns {object} the user found or undefined if the id does not lead to a user
   */
  getOne(id) {
    const users = parse(this.jsonDbPath, this.defaultItems);
    const foundIndexUser = users.findIndex((user) => user.id == id);
    if (foundIndexUser < 0) return;

    return users[foundIndexUser];
  }

  /**
   * Returns the user identified by email
   * @param {string} email - email of the user to find
   * @returns {object} the user found or undefined if the email does not lead to a user
   */
  getOneByEmail(email) {
    const users = parse(this.jsonDbPath, this.defaultItems);
    const foundIndexUser = users.findIndex((user) => user.email == email);
    if (foundIndexUser < 0) return;

    return users[foundIndexUser];
  }
  getAllPokemonByUserCollection(userId) {
    const users = parse(this.jsonDbPath);
    const foundIndexUser = users.findIndex((user) => user.id == userId);
    if (foundIndexUser < 0) return;

    const pokemons = parse(jsonPokemonDbPath);
    var collection = [];

    users[foundIndexUser].collections.forEach(pokemonId => {
      const foundIndexPokemon = pokemons.findIndex((pokemon) => pokemon.id == pokemonId)
      if (foundIndexPokemon < 0) return;

      collection[collection.length] = pokemons[foundIndexPokemon];


    });
    return collection;
  }

  /**
   * Add a user in the DB and returns - as Promise - the added user (containing a new id)
   * @param {object} body - it contains all required data to create a user
   * @returns {Promise} Promise reprensents the user that was created (with id)
   */

  async addOne(body) {
    const users = parse(this.jsonDbPath, this.defaultItems);

    // hash the password (async call)
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    // add new user to the menu

    const newitem = {
      id: this.getNextId(),
      email: body.email,
      pseudo: body.pseudo,
      password: hashedPassword,
      coins: 0,
    };
    users.push(newitem);
    serialize(this.jsonDbPath, users);
    return newitem;
  }


  /**
   * Delete a user in the DB and return the deleted user
   * @param {number} id - id of the user to be deleted
   * @returns {object} the user that was deleted or undefined if the delete operation failed
   */
  deleteOne(id) {
    const users = parse(this.jsonDbPath, this.defaultItems);
    const foundIndexUser = users.findIndex((user) => user.id == id);
    if (foundIndexUser < 0) return;
    const itemRemoved = users.splice(foundIndexUser, 1);
    serialize(this.jsonDbPath, users);

    return itemRemoved[0];
  }

  /**
   * Update a user in the DB and return the updated user
   * @param {number} id - id of the user to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated user or undefined if the update operation failed
   */
  updateOne(id, body) {
    const users = parse(this.jsonDbPath, this.defaultItems);
    const foundIndexUser = users.findIndex((user) => user.id == id);
    if (foundIndexUser < 0) return;
    // create a new object based on the existing user - prior to modification -
    // and the properties requested to be updated (those in the body of the request)
    // use of the spread operator to create a shallow copy and repl
    const updateditem = {
      ...users[foundIndexUser],
      ...body
    };
    // replace the user found at index : (or use splice)
    users[foundIndexUser] = updateditem;

    serialize(this.jsonDbPath, users);
    return updateditem;
  }

  /**
   * Update a user in the DB and return the updated user
   * @param {number} id - id of the user to be updated
   * @param {object} body - it contains all the data to be updated
   * @returns {object} the updated user or undefined if the update operation failed
   */
  async updateOneUser(id, body) {
    const users = parse(this.jsonDbPath, this.defaultItems);
    const foundIndexUser = users.findIndex((user) => user.id == id);
    if (foundIndexUser < 0) return;

    //const pseudo = escape(req.body.pseudo);
    //const email = escape(req.body.email);
    const currentPassword = escape(body.currentPassword);
    const newPassword = escape(body.newPassword);

    // check if currentPassword == password of the user
    const match = await bcrypt.compare(currentPassword, users[foundIndexUser].password);
    if (!match) return;

    // hash the password (async call)
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    users[foundIndexUser].password = hashedPassword;
    serialize(this.jsonDbPath, users);
    return users[foundIndexUser];
  }

  /**
   * Update a user in the DB and return the updated user
   * @param {number} id - id of the user to be updated
   * @param {number} coins - it contains all the data to be updated
   * @returns {object} the updated user or undefined if the update operation failed
   */
  updateUserCoins(id, coins) {
    const users = parse(this.jsonDbPath, this.defaultItems);
    const foundIndexUser = users.findIndex((user) => user.id == id);
    if (foundIndexUser < 0) return;
    //fait ça pour éviter toutes tentatives d'injections, + doit le remettre en int car escape le transforme en String
    var coinsToAdd = escape(coins);
    var intCoinsToAdd = parseInt(coinsToAdd);

    users[foundIndexUser].coins = users[foundIndexUser].coins + intCoinsToAdd;;

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    let coinsHistoryUser = {
      date: dateTime,
      userId: id,
      coins: intCoinsToAdd
    };

    const coinsHistoryList = parse(jsonCoinsHistoryForUserDbPath);
    coinsHistoryList.push(coinsHistoryUser);

    serialize(jsonCoinsHistoryForUserDbPath, coinsHistoryList);
    serialize(jsonDbPath, users);
    return users[foundIndexUser];
  }

  addPokemonInUserCollection(userId, pokemonId) {
    var users = parse(jsonDbPath);
    var pokemons = parse(jsonPokemonDbPath);
    const foundIndexUser = users.findIndex((user) => user.id == userId);
    if (foundIndexUser < 0) return;

    const foundIndexPokemon = pokemons.findIndex((pokemon) => pokemon.id == pokemonId)
    if (foundIndexPokemon < 0) return;
    var collection = users[foundIndexUser].collections;
    collection[collection.length] = parseInt(pokemonId);
    users[foundIndexUser].collections = collection;
    console.log(users[foundIndexUser])
    serialize(jsonDbPath, users);
    return users[foundIndexUser];
  }

  /**
   * Authenticate a user and generate a token if the user credentials are OK
   * @param {*} email
   * @param {*} password
   * @returns {Promise} Promise reprensents the authenticatedUser ({username:..., token:....}) or undefined if the user could not
   * be authenticated
   */

  async login(email, password) {
    const userFound = this.getOneByEmail(escape(email));
    if (!userFound) return;
    // checked hash of passwords
    const match = await bcrypt.compare(escape(password), userFound.password);
    if (!match) return;

    const authenticatedUser = {
      id: userFound.id,
      email: userFound.email,
      pseudo: userFound.pseudo,
      coins: userFound.coins,
      token: "Future signed token",
    };

    // replace expected token with JWT : create a JWT
    const token = jwt.sign({
        email: authenticatedUser.email
      }, // session data in the payload
      jwtSecret, // secret used for the signature
      {
        expiresIn: LIFETIME_JWT
      } // lifetime of the JWT
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  }

  /**
   * Create a new user in DB and generate a token
   * @param {*} email
   * @param {*} pseudo
   * @param {*} password
   * @returns the new authenticated user ({username:..., token:....}) or undefined if the user could not
   * be created (if username already in use)
   */

  async register(email, pseudo, password) {
    const userFound = this.getOneByEmail(escape(email));
    if (userFound) return;

    const newUser = await this.addOne({
      email: escape(email),
      pseudo: escape(pseudo),
      password: escape(password)
    });

    const authenticatedUser = {
      id: newUser.id,
      email: newUser.email,
      pseudo: newUser.pseudo,
      coins: newUser.coins,
      token: "Future signed token",
    };

    // replace expected token with JWT : create a JWT
    const token = jwt.sign({
        email: authenticatedUser.email
      }, // session data in the payload
      jwtSecret, // secret used for the signature
      {
        expiresIn: LIFETIME_JWT
      } // lifetime of the JWT
    );

    authenticatedUser.token = token;
    return authenticatedUser;
  }
}

module.exports = {
  Users
};
"use strict"
const jsonDbPath = __dirname + "/../data/pokemons.json";
const {parse} = require("../utils/json");
class Pokemon {
    constructor(dbPath = jsonDbPath) {
        this.jsonDbPath = dbPath;
      }
    getAll(){
        const pokemons = parse(jsonDbPath);
        return pokemons;
    }
    getAllSorted(sortValue){
        return null;
    }
    getByName(name){
        const pokemon = null;
        return pokemon;
    }
    getById(id){
        const pokemon = null;
        return pokemon;
    }
    getOneRandom(){
        //A vérifier
        let randomID = Math.floor(Math.random() * (data.length));
        const pokemon = null;
        return pokemon;
    }

}
module.exports = {Pokemon};
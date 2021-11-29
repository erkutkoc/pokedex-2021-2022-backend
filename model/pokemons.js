"use strict"
const jsonDbPath = __dirname + "/../data/pokemons.json";
const {parse,serialize} = require("../utils/json");
class Pokemon {
    constructor(pokemon) {
        this.pokemon = pokemon;
      }
    getAll(){
        const pokemons = parse(jsonDbPath);
        return pokemons;
    }
    getAllSorted(filter = undefined, value = undefined){
        const pokemons = parse(jsonDbPath);
        if(filter == "HP")
        console.log(pokemons.sort((a, b)=> a.base.HP < b.base.HP))
    }
    getByName(name){
        const pokemons = parse(jsonDbPath);
        const foundIndex = pokemons.findIndex((pokemon) => pokemon.name.french.toLowerCase() == name.toLowerCase() ||  pokemon.name.english.toLowerCase() == name.toLowerCase());
        if (foundIndex < 0) return;
        return pokemons[foundIndex];
    }
    getById(id){
        const pokemons = parse(jsonDbPath);
        const foundIndex = pokemons.findIndex((pokemon) => pokemon.id == id);
        if (foundIndex < 0) return;
        return pokemons[foundIndex];
    }
    getOneRandom(){
        //A vérifier
        let randomID = Math.floor(Math.random() * (data.length));
        const pokemon = null;
        return pokemon;
    }

}
module.exports = {Pokemon};
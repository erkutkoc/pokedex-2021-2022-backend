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
    getAllSorted(filter, value){
        var filterr = filter; 
        var valuee = value;
        let pokemons = parse(jsonDbPath);
        pokemons = pokemons.filter(a => a.base != undefined);
        if(filterr == 'HP'){
            if(valuee == 'ASC'){
               return pokemons.sort(function(a, b) {
                return a.base.HP - b.base.HP;
              });
            }
            else {
                return  pokemons.sort(function(a, b) {
                    return b.base.HP - a.base.HP;
                  });
                }
        }/*
        if(filter == "Defense"){
            if(value == "ASC"){
                pokemons.sort((a, b)=> a.base.Defense < b.base.Defense);
            }
            else {
                pokemons.sort((a, b)=> a.base.Defense > b.base.Defense);
            }
        }
        if(filter === "Attack"){
            if(value === "ASC"){
                console.log(pokemons.sort((a, b)=> a.base.Attack < b.base.Attack))
            }
            else {
                console.log(pokemons.sort((a, b)=> a.base.Attack > b.base.Attack))
            }
        }
        if(filter === "Speed"){
            if(value === "ASC"){
                console.log(pokemons.sort((a, b)=> a.base.Speed < b.base.Speed))
            }
            else {
                console.log(pokemons.sort((a, b)=> a.base.Speed > b.base.Speed))
            }
        }
        */
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
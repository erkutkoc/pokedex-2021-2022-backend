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
        }if(filterr == 'Attack'){
            if(valuee == 'ASC'){
               return pokemons.sort(function(a, b) {
                return a.base.Attack - b.base.Attack;
              });
            }
            else {
                return  pokemons.sort(function(a, b) {
                    return b.base.Attack - a.base.Attack;
                  });
                }
        }if(filterr == 'Defence'){
            if(valuee == 'ASC'){
               return pokemons.sort(function(a, b) {
                return a.base.Defence - b.base.Defence;
              });
            }
            else {
                return  pokemons.sort(function(a, b) {
                    return b.base.Defence - a.base.Defence;
                  });
                }
        }
        if(filterr == 'Speed'){
            if(valuee == 'ASC'){
               return pokemons.sort(function(a, b) {
                return a.base.Speed - b.base.Speed;
              });
            }
            else {
                return  pokemons.sort(function(a, b) {
                    return b.base.Speed - a.base.Speed;
                  });
                }
        }
        
    }
    getByName(name){
        const pokemons = parse(jsonDbPath);
        const foundIndex = pokemons.findIndex((pokemon) => pokemon.name.english.toLowerCase() == name.toLowerCase() ||  pokemon.name.english.toLowerCase() == name.toLowerCase());
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
        
        let pokemons = parse(jsonDbPath);
        pokemons = pokemons.filter(a => a.base != undefined);
        let randomID = Math.floor(Math.random() * (pokemons.length));
        const pokemon = this.getById(randomID);
        return pokemon;
    }

}
module.exports = {Pokemon};
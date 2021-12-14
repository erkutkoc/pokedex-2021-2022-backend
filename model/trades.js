"use strict"
const jsonDbPath = __dirname + "/../data/trades.json";
const {
  parse,
  serialize
} = require("../utils/json");
class Trades {
  constructor(trade) {
    this.trade = trade;
  }
  /*
  return all trades
  */
  getAll() {
    const trades = parse(jsonDbPath);
    console.log(trades)
    return trades;
  }
  /*
  return one trade by id
  */
  getTraderById(id) {
    const trades = parse(jsonDbPath);
    const foundIndex = trades.findIndex((trade) => trade.id_trader == id);
    if (foundIndex < 0) return;
    return trades[foundIndex];
  }
  /*
  Return an exchange proposition proposed by the trader by trade id
  */
  getTraderProposition(id){
    const trades = parse(jsonDbPath);
    const foundIndex = trades.findIndex((trade) => trade.id_trader == id);
    if (foundIndex < 0) return;
    const objectToReturn = [trades[foundIndex].id, trades[foundIndex].propositions]
    return objectToReturn;
  }
    /*
  Return an exchange requests proposed by the trader by trade id
  */
  getTraderRequest(id){
    const trades = parse(jsonDbPath);
    const foundIndex = trades.findIndex((trade) => trade.id_trader == id);
    if (foundIndex < 0) return;
    const objectToReturn = [trades[foundIndex].id, trades[foundIndex].requests]
    return objectToReturn;
  }
    /*
  Return all exchanges offers proposed by the other people for this trades by trade id
  */
  getOthersOffersByTradeId(id){
    const trades = parse(jsonDbPath);
    const foundIndex = trades.findIndex((trade) => trade.id == id);
    if (foundIndex < 0) return;
    const objectToReturn = [trades[foundIndex].id, trades[foundIndex].other_offers]
    return objectToReturn;
  }
      /*
  Return trade status by trade id
  */
  getTradeStatus(id){
    const trades = parse(jsonDbPath);
    const foundIndex = trades.findIndex((trade) => trade.id == id);
    if (foundIndex < 0) return;
    return trades[foundIndex].status;
  }

}
module.exports = {
  Trades
};
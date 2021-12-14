"use strict"
const tradesDbPath = __dirname + "/../data/trades.json";
const usersDbPath = __dirname + "/../data/users.json";
const e = require("express");
const {
  parse,
  serialize
} = require("../utils/json");
class Trades {
  constructor(trades = tradesDbPath, users = usersDbPath) {
    this.tradesDbPath = trades;
    this.usersDbPath = users;
  }
  /*########################### Getters ###########################*/
  /*
  return all trades
  */
  getAll() {
    const trades = parse(tradesDbPath);
    console.log(trades)
    return trades;
  }
  /*
  return one trade by id
  */
  getTraderById(id) {
    const trades = parse(tradesDbPath);
    const foundIndex = trades.findIndex((trade) => trade.id_trader == id);
    if (foundIndex < 0) return;
    return trades[foundIndex];
  }
  /*
  Return an exchange proposition proposed by the trader by trade id
  */
  getTraderProposition(id) {
    const trades = parse(tradesDbPath);
    const foundIndex = trades.findIndex((trade) => trade.id_trader == id);
    if (foundIndex < 0) return;
    const objectToReturn = [trades[foundIndex].id, trades[foundIndex].propositions]
    return objectToReturn;
  }
  /*
  Return an exchange requests proposed by the trader by trade id
  */
  getTraderRequest(id) {
    const trades = parse(tradesDbPath);
    const foundIndex = trades.findIndex((trade) => trade.id_trader == id);
    if (foundIndex < 0) return;
    const objectToReturn = [trades[foundIndex].id, trades[foundIndex].requests]
    return objectToReturn;
  }
  /*
  Return all exchanges offers proposed by the other people for this trades by trade id
  */
  getOthersOffersByTradeId(id) {
    const trades = parse(tradesDbPath);
    const foundIndex = trades.findIndex((trade) => trade.id == id);
    if (foundIndex < 0) return;
    const objectToReturn = [trades[foundIndex].id, trades[foundIndex].other_offers]
    return objectToReturn;
  }
  /*
  Return trade status by trade id
  */
  getTradeStatus(id) {
    const trades = parse(tradesDbPath);
    console.log(trades)
    const foundIndex = trades.findIndex((trade) => trade.id == id);
    if (foundIndex < 0) return;
    return trades[foundIndex].status;
  }
  /*########################### Getters End ###########################*/
  /*########################### Add ###########################*/
  addTrade(idTrader, requests, propositions) {
    const users = parse(this.usersDbPath);
    const foundIndexUser = users.findIndex((user) => user.id == idTrader);
    if (foundIndexUser < 0) return;
    let traderCollections = users[foundIndexUser].collections;
    if (this.containsCard(requests, propositions)) { // cehck if requests != propositions
      return null;
    } else if (!this.containsCard(traderCollections, propositions)) { // check if users collections contains propositions card
      return null;
    } else {
      propositions.forEach(element => {
        this.deleteCardUserCollection(element, idTrader)
      });
      const trades = parse(this.tradesDbPath);
      let id = this.getNextId();
      const newTrade = {
        id: id,
        id_trader: idTrader,
        id_acceptor: -1,
        requests: requests,
        propositions: propositions,
        other_offers: {
          offers: Array(null)
        },
        status: "En cours"
      };
      trades.push(newTrade);
      serialize(this.tradesDbPath, trades);
      return newTrade;
    }
  }
  addOffer(id, idAcceptor, propositions) {
    const users = parse(this.usersDbPath);
    const foundIndexUser = users.findIndex((user) => user.id == idAcceptor);
    if (foundIndexUser < 0) return;
    const trades = parse(this.tradesDbPath);
    let tradeIndex = trades.findIndex((trade) => trade.id == id);
    if (tradeIndex < 0) return;
    if (idAcceptor != trades[tradeIndex].id_trader) {
      let acceptorCollections = users[foundIndexUser].collections;
      if (this.containsCard(trades[tradeIndex].propositions, propositions)) {
        return null;
      } else if (!this.containsCard(acceptorCollections, propositions)) { // check if users collections contains propositions card
        return null;
      } else {
        propositions.forEach(element => {
          this.deleteCardUserCollection(element, idAcceptor)
        });
        let newOffer = {
          id_acceptor: idAcceptor,
          propositions: propositions
        };
        trades[tradeIndex].other_offers.offers[trades[tradeIndex].other_offers.offers.length] = newOffer;
        serialize(this.tradesDbPath, trades);
        return newOffer;
      }
    } else {
      return null;
    }
  }
  cancelTrade(id) {
    const trades = parse(this.tradesDbPath);
    if (tradeIndex < 0) return;
    const users = parse(this.usersDbPath);
    let tradeIndex = trades.findIndex((trade) => trade.id == id);
    if (trades[tradeIndex].status != "Cancel") {
      trades[tradeIndex].status = "Cancel";
      let foundIndexUser = -1;
      trades[tradeIndex].other_offers.offers.forEach(offer => {
        foundIndexUser = users.findIndex((user) => user.id == offer.id_acceptor);
        if (foundIndexUser < 0) return;
        console.log(foundIndexUser)
        offer.propositions.forEach(element => {
          users[foundIndexUser].collections[users[foundIndexUser].collections.length] = element;
        });
      });
      let foundIndexTrader = users.findIndex((user) => user.id == trades[tradeIndex].id_trader);
      if (foundIndexTrader < 0) return;
      trades[tradeIndex].propositions.forEach(element => {
        users[foundIndexTrader].collections[users[foundIndexTrader].collections.length] = element;
      });
      serialize(this.usersDbPath, users);
      serialize(this.tradesDbPath, trades);
      return true;
    }
    return false;
  }
  cancelTradeOffer(id, idAcceptor) {
    const trades = parse(this.tradesDbPath);
    let tradeIndex = trades.findIndex((trade) => trade.id == id);
    if (tradeIndex < 0) return;
    const users = parse(this.usersDbPath);
    let foundIndexUser = users.findIndex((user) => user.id == idAcceptor);
    if (foundIndexUser < 0) return;


    if (tradeIndex < 0) return;
    if (trades[tradeIndex].status != "Cancel") {
      trades[tradeIndex].other_offers.offers.forEach(offer => {
        if (offer.id_acceptor == idAcceptor) {
          offer.propositions.forEach(element => {
            users[foundIndexUser].collections[users[foundIndexUser].collections.length] = element;
          });
        }
      });
      let foundIndex = trades[tradeIndex].other_offers.offers.findIndex((e) => e.id_acceptor == idAcceptor);
      if (foundIndexUser < 0) return;
      trades[tradeIndex].other_offers.offers.splice(foundIndex, 1);
      serialize(this.usersDbPath, users);
      serialize(this.tradesDbPath, trades);
      return true;
    }
    return false;
  }
  acceptTrade(id, idAcceptor) {
    const trades = parse(this.tradesDbPath);
    let tradeIndex = trades.findIndex((trade) => trade.id == id);
    if (tradeIndex < 0) return;
    if (trades[tradeIndex].status != "Accept") {
      const users = parse(this.usersDbPath);
      trades[tradeIndex].id_acceptor = idAcceptor;
      trades[tradeIndex].status = "Accept";
      let foundIndexUser = -1;
      trades[tradeIndex].other_offers.offers.forEach(element => {
        foundIndexUser = users.findIndex((user) => user.id == element.id_acceptor);
        if (foundIndexUser < 0) return;
        element.propositions.forEach(element => {
          console.log(element)
          users[foundIndexUser].collections[users[foundIndexUser].collections.length] = element;
        });

      });
      let foundIndexAcceptor = users.findIndex((user) => user.id == idAcceptor);
      if (foundIndexAcceptor < 0) return;
      trades[tradeIndex].propositions.forEach(element => {
        users[foundIndexAcceptor].collections[users[foundIndexAcceptor].collections.length] = element;
      });
      let foundIndexTrader = users.findIndex((user) => user.id == trades[tradeIndex].id_trader);
      if (foundIndexTrader < 0) return;
      trades[tradeIndex].requests.forEach(element => {
        users[foundIndexTrader].collections[users[foundIndexTrader].collections.length] = element;
      });
      trades[tradeIndex].status = "Accept";
      serialize(this.usersDbPath, users);
      serialize(this.tradesDbPath, trades);
      return true;
    }
    return false;
  }
  acceptTradeOffer(id, idAcceptor) {
    const trades = parse(this.tradesDbPath);
    let tradeIndex = trades.findIndex((trade) => trade.id == id);
    if (tradeIndex < 0) return;
    const users = parse(this.usersDbPath);
    let foundTraderIndex = users.findIndex((user) => user.id == trades[tradeIndex].id);
    if (trades[tradeIndex].status != "Accept") {
      trades[tradeIndex].status = "Accept";
      trades[tradeIndex].id_acceptor = idAcceptor;
      let foundIndexAcceptor = users.findIndex((user) => user.id == idAcceptor);
      if (foundIndexAcceptor < 0) return;
      trades[tradeIndex].propositions.forEach(p => {
        users[foundIndexAcceptor].collections[users[foundIndexAcceptor].collections.length] = p;
      })
      trades[tradeIndex].other_offers.offers.forEach(element => {
        element.propositions.forEach(element => {
          if (element.id_acceptor == idAcceptor) {
            users[foundTraderIndex].collections[users[foundIndexAcceptor].collections.length] = element;
          } else {
            let foundIndexAcceptorToRestore = users.findIndex((user) => user.id == element.idAcceptor);
            if (foundIndexAcceptorToRestore < 0) return;
            users[foundIndexAcceptorToRestore].collections[users[foundIndexAcceptor].collections.length] = element;
          }
        });
      });
      serialize(this.usersDbPath, users);
      serialize(this.tradesDbPath, trades);
      return true;
    }
    return false;
  }
  /*########################### Add End ###########################*/
  /*########################### Utils ###########################*/
  getNextId() {
    const trades = parse(this.tradesDbPath);
    let nextId;
    if (trades.length === 0) nextId = 1;
    else nextId = trades[trades.length - 1].id + 1;
    return nextId;
  }
  /*
  delete one element at index 
  */
  deleteCardUserCollection(element, idTrader) {
    const users = parse(this.usersDbPath);
    const foundIndexUser = users.findIndex((user) => user.id == idTrader);
    let collections = users[foundIndexUser].collections;
    const indexToDelete = collections.findIndex((e) => e == element);
    collections.splice(indexToDelete, 1);
    users[foundIndexUser].collections = collections;
    serialize(this.usersDbPath, users);
  }
  /*
  check if array1 & array2 contains same card
   */
  containsCard(array1, array2) {
    let index = 0;
    while (index < array1.length) {
      if (array2.some(e2 => array1[index] == e2)) {
        return true;
      };
      index++;
    }
  }

  /*########################### Utils End ###########################*/

}
module.exports = {
  Trades
};
"use strict";
let express = require("express");
const { authorize } = require("../utils/authorize");
let router = express.Router();
const { Trades } = require("../model/trades");
const { response } = require("express");
const tradeModel = new Trades();

router.get("/", function (req, res) {
  return res.json(tradeModel.getAll());
});
/**
 *
 */
router.get(
  "/filteredTradingCollection/:id_trader/:id_acceptor",
  function (req, res) {
    return res.json(
      tradeModel.getFilteredCollections(
        req.params.id_trader,
        req.params.id_acceptor
      )
    );
  }
);
/**
 * param  = req.params.id
 */
router.get("/:id", function (req, res) {
  const id = req.params.id;

  const trade = tradeModel.getTraderById(id);

  if (!trade) return res.status(404).end();
  return res.json(trade);
});
/**
 * param  = req.params.id
 */
router.get("/:id/propositions", function (req, res) {
  const id = req.params.id;
  const trade = tradeModel.getTraderProposition(id);
  if (!trade) return res.status(404).end();
  return res.json(trade);
});
/**
 * param  = req.params.id
 */
router.get("/:id/requests", function (req, res) {
  const id = req.params.id;
  const trade = tradeModel.getTraderRequest(id);
  if (!trade) return res.status(404).end();
  return res.json(trade);
});
/**
 * param  = req.params.id
 */
router.get("/:id/others_offers", function (req, res) {
  const id = req.params.id;
  const trade = tradeModel.getOthersOffersByTradeId(id);
  if (!trade) return res.status(404).end();
  return res.json(trade);
});
/**
 * param  = req.params.id
 */
router.get("/:id/status", function (req, res) {
  const id = req.params.id;
  const trade = tradeModel.getTradeStatus(id);
  if (!trade) return res.status(404).end();
  return res.json(trade);
});
/**
 * e.g 
 * body = {
    "idTrader" : 1,
    "requests" : [43, 4], // this != propositions 
    "propositions" : [1,2] // this != users.collections
}
 */
router.post("/", authorize, function (req, res) {
  if (!req.body) return res.status(400).end();
  if (!req.body.idTrader || !req.body.requests || !req.body.propositions)
    return res.status(400).end();
  const trade = tradeModel.addTrade(
    req.body.idTrader,
    req.body.requests,
    req.body.propositions
  );
  if (!trade) return res.status(400).end();
  return res.json(trade);
});
/**
 * body = 
 * {
    "id" : 1,
    "id_acceptor" : 2, 
    "propositions" : [6, 400]
}
 */
router.put("/offers", authorize, function (req, res) {
  if (!req.body) return res.status(400).end();
  if (!req.body.id || !req.body.id_acceptor || !req.body.propositions)
    return res.status(400).end();
  const otherOffers = tradeModel.addOffer(
    req.body.id,
    req.body.id_acceptor,
    req.body.propositions
  );
  if (!otherOffers) response.status(400).end();
  return res.json(otherOffers);
});
/**
 * param  = req.params.id
 * http://localhost:3000/trades/cancel/1
 */
router.put("/cancel/:id", authorize, function (req, res) {
  const trade = tradeModel.cancelTrade(req.params.id);
  if (!trade) return res.status(400).end();
  return res.json(trade);
});
/**
 * body = 
 * {
    "id":1,"id_acceptor": 2
}
 */
router.put("/offers/cancel", authorize, function (req, res) {
  if (!req.body) return res.status(400).end();
  if (!req.body.id || !req.body.id_acceptor) return res.status(400).end();
  const trade = tradeModel.cancelTradeOffer(req.body.id, req.body.id_acceptor);
  if (!trade) return res.status(400).end();
  return res.json(trade);
});
/**
 * e.g 
 * body = {"id": 1,
            "id_acceptor": 2}
 */
router.put("/accept", authorize, function (req, res) {
  if (!req.body) return res.status(400).end();
  if (!req.body.id || !req.body.id_acceptor) return res.status(400).end();
  const trade = tradeModel.acceptTrade(req.body.id, req.body.id_acceptor);
  if (!trade) return res.status(400).end();
  return res.json(trade);
});
/**
 * e.g 
 * body = {"id": 1,
            "id_acceptor": 2}
 */
router.put("/accept/offer", authorize, function (req, res) {
  if (!req.body) return res.status(400).end();
  if (!req.body.id || !req.body.id_acceptor) return res.status(400).end();
  const trade = tradeModel.acceptTradeOffer(req.body.id, req.body.id_acceptor);
  if (!trade) return res.status(400).end();
  return res.json(trade);
});

module.exports = router;

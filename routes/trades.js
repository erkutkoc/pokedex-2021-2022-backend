"use strict";
let express = require("express");
const {
    authorize
} = require("../utils/authorize");
let router = express.Router();
const {
    Trades
} = require("../model/trades");
const tradeModel = new Trades();


router.get("/", function (req, res) {
    console.log("GET /trades");
    return res.json(tradeModel.getAll());
});
/**
 * param  = req.params.id
 */
router.get("/:id", function (req, res) {
    const id = req.params.id;
    console.log("GET /trades/id/" + id);
    const trade = tradeModel.getTraderById(id);
    if (!trade) return res.status(404).end();
    return res.json(trade);
});
/**
 * param  = req.params.id
 */
router.get("/:id/propositions", function (req, res) {
    const id = req.params.id;
    console.log("GET /trades/id/" + id);
    const trade = tradeModel.getTraderProposition(id);
    if (!trade) return res.status(404).end();
    return res.json(trade);
});
/**
 * param  = req.params.id
 */
router.get("/:id/requests", function (req, res) {
    const id = req.params.id;
    console.log("GET /trades/id/" + id);
    const trade = tradeModel.getTraderRequest(id);
    if (!trade) return res.status(404).end();
    return res.json(trade);
});
/**
 * param  = req.params.id
 */
router.get("/:id/others_offers", function (req, res) {
    const id = req.params.id;
    console.log("GET /trades/id/" + id);
    const trade = tradeModel.getOthersOffersByTradeId(id);
    if (!trade) return res.status(404).end();
    return res.json(trade);
});
/**
 * param  = req.params.id
 */
router.get("/:id/status", function (req, res) {
    const id = req.params.id;
    console.log("GET /trades/id/" + id);
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
router.post("/", function (req, res) {
    if (!req.body) return res.status(400).end();
    if (!req.body.idTrader || !req.body.requests || !req.body.propositions) return res.status(400).end();
    const trade = tradeModel.addTrade(req.body.idTrader, req.body.requests, req.body.propositions);
    if (!trade) return res.status(400).end();
    return res.json(trade);
});
/**
 * 
 */
router.put("/offers", function (req, res) {
    if (!req.body) return res.status(400).end();
    if (!req.body.id || !req.body.id_acceptor || !req.body.propositions) return res.status(400).end();
    console.log(req.body)
    const otherOffers = tradeModel.addOffer(req.body.id, req.body.id_acceptor, req.body.propositions);
    return otherOffers;
});
router.put("/", function (req, res) {
    if (!req.body) return res.status(400).end();
    if (!req.body.idTrader || !req.body.requests || !req.body.propositions) return res.status(400).end();

    const trade = tradeModel.addOffer(req.body.idTrader, req.body.requests, req.body.propositions);
    if (!trade) return res.status(400).end();
    return res.json(trade);
});

module.exports = router;
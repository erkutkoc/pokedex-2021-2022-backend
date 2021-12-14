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
router.get("/:id", function (req, res) {
    const id = req.params.id;
    console.log("GET /trades/id/" + id);
    const trade = tradeModel.getTraderById(id);
    if (!trade) return res.status(404).end();
    return res.json(trade);
});
router.get("/:id/propositions", function (req, res) {
    const id = req.params.id;
    console.log("GET /trades/id/" + id);
    const trade = tradeModel.getTraderProposition(id);
    if (!trade) return res.status(404).end();
    return res.json(trade);
});
router.get("/:id/requests", function (req, res) {
    const id = req.params.id;
    console.log("GET /trades/id/" + id);
    const trade = tradeModel.getTraderRequest(id);
    if (!trade) return res.status(404).end();
    return res.json(trade);
});
router.get("/:id/others_offers", function (req, res) {
    const id = req.params.id;
    console.log("GET /trades/id/" + id);
    const trade = tradeModel.getOthersOffersByTradeId(id);
    if (!trade) return res.status(404).end();
    return res.json(trade);
});
router.get("/:id/status", function (req, res) {
    const id = req.params.id;
    console.log("GET /trades/id/" + id);
    const trade = tradeModel.getTradeStatus(id);
    if (!trade) return res.status(404).end();
    return res.json(trade);
});

module.exports = router;
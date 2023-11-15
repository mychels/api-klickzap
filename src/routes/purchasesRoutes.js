import express from "express";
import PurchaseControler from "../controllers/purchaseController.js";

const routes = express.Router();

// mongodb
//routes.post("/purchase", PurchaseControler.cadastrarPurchase);

//mysql
routes.post("/purchase", PurchaseControler.cadastrarPurchase);

export default routes;

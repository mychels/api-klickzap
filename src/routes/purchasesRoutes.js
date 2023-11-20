import express from "express";
import PurchaseControler from "../controllers/purchaseController.js";
import JsonController from "../controllers/jsonTestController.js";

const routes = express.Router();

// mongodb
//routes.post("/purchase", PurchaseControler.cadastrarPurchase);

//mysql
routes.post("/purchase", PurchaseControler.cadastrarPurchase);
//routes.post("/purchase", JsonController.testJSON);

export default routes;

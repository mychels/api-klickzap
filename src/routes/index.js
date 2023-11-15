import express from "express";
import purchases from "./purchasesRoutes.js";
import licenses from "./licensesRoutes.js";

const routes = (app) => {
  app.route("/").get((req, res) => {
    res.status(200).send("API em funcionamento");
  });

  app.use(express.json(), purchases);
  app.use(express.json(), licenses);
};

export default routes;

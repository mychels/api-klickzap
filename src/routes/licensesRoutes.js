import express from "express";
import LicenseControler from "../controllers/licenseController.js";
import JsonController from "../controllers/jsonTestController.js";

const routes = express.Router();

//routes.put("/license", LicenseControler.ativarLicenca);
//routes.post("/license", LicenseControler.verificarLicenca);
routes.put("/license", JsonController.testJSON);

export default routes;

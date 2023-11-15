import express from "express";
import LicenseControler from "../controllers/licenseController.js";

const routes = express.Router();

routes.put("/license", LicenseControler.activateLicense);

export default routes;

import licenseSold from "../models/LicenseSold.js";

export default class LicenseSoldController {
  static async vincularLicenca(user_id, license_id) {
    try {
      const newLicenseSold = await licenseSold.vincularLicenca(
        user_id,
        license_id
      );
      console.log("Concluido");
    } catch (e) {
      console.log("Erro ao tentar cadastrar uma licenseSold", e);
      return;
    }
  }
}

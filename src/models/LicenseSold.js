import pool from "../config/dbConnect.js";

export default class LicenseSoldModel {
  static async vincularLicenca(user_id, license_id) {
    const con = await pool.getConnection();

    try {
      // Execute a inserção do vinculo entre licenca e usuario vendedor
      const [result] = await con.query(
        "INSERT INTO licenses_sold (user_id, license_id) VALUES (?, ?)",
        [user_id, license_id]
      );

      // Verifique se a inserção foi bem-sucedida
      if (result.affectedRows === 1) {
        console.log("LicenseSold cadastrada com sucesso.");

        const licenseSoldAdded = {
          id: result.insertId, // O ID gerado para o vinculo
          user_id,
          license_id,
        };
        return licenseSoldAdded;
      } else {
        return null; // Retorna null se a inserção falhou
      }
    } catch (e) {
      console.error("Erro na inserção da LicenseSold:", e);
      throw e;
    } finally {
      con.release(); // Libere a conexão de volta para o pool
    }
  }
}

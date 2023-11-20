import pool from "../config/dbConnect.js";

export default class PurchaseModel {
  static async cadastrarPurchase(
    user_id,
    order_ref,
    order_status,
    payment_method,
    created_at,
    numero_extraido
  ) {
    const con = await pool.getConnection();

    try {
      // Execute a inserção da nova compra
      const [result] = await con.query(
        "INSERT INTO purchases (user_id, order_ref, order_status, payment_method, created_at, licenses_purchased) VALUES (?, ?, ?, ?, ?, ?)",
        [
          user_id,
          order_ref,
          order_status,
          payment_method,
          created_at,
          numero_extraido,
        ]
      );

      // Verifique se a inserção foi bem-sucedida
      if (result.affectedRows === 1) {
        console.log("Purchase cadastrada com sucesso.");

        const purchaseAdded = {
          id: result.insertId, // O ID gerado para a nova purchase
          user_id,
          order_ref,
          order_status,
          payment_method,
          created_at,
          numero_extraido,
        };
        return purchaseAdded;
      } else {
        return null; // Retorna null se a inserção falhou
      }
    } catch (e) {
      console.error("Erro na inserção da purchase:", e);
      throw e;
    } finally {
      con.release(); // Libere a conexão de volta para o pool
    }
  }
}

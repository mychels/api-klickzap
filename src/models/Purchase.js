import pool from "../config/dbConnect.js";

export default class PurchaseModel {
  static async cadastrarPurchase(
    user_id,
    order_ref,
    order_status,
    payment_method,
    created_at,
    licenses_purchased,
    nome_plano
  ) {
    const con = await pool.getConnection();

    try {
      // 1 Licença - Mensal / 1 Licença - Anual /

      // Texto inicial
      var texto = nome_plano;

      // Dividir o texto com base no caractere "-"
      var partes = texto.split(" - ");

      // Extrair o número da parte 1 usando expressão regular
      var numeroParte1 = partes[0].match(/\d+/); // Isso irá retornar um array de correspondências

      // Se houver uma correspondência, pega o primeiro elemento (o número)
      var numeroExtraido = numeroParte1 ? parseInt(numeroParte1[0]) : null;

      // Exibindo o número extraído
      console.log("Número extraído da parte 1: ", numeroExtraido);

      // Agora, partes[0] conterá "20 Licenças" e partes[1] conterá "Anual"
      var parte1 = partes[0];
      var parte2 = partes[1];

      // Exibindo as partes
      console.log("Parte 1:", parte1);
      console.log("Parte 2:", parte2);

      // Execute a inserção do novo usuário
      const [result] = await con.query(
        "INSERT INTO purchases (user_id, order_ref, order_status, payment_method, created_at, licenses_purchased) VALUES (?, ?, ?, ?, ?, ?)",
        [
          user_id,
          order_ref,
          order_status,
          payment_method,
          created_at,
          licenses_purchased,
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
          licenses_purchased,
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

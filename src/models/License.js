import pool from "../config/dbConnect.js";
import LicenseController from "../controllers/licenseController.js";
import LicenseSoldController from "../controllers/licenseSoldController.js";

export default class LicenseModel {
  static async cadastrarLicense(id_purchase, qtd, idUserVendedor, validade) {
    try {
      let contador = 0;
      // gerar as chaves de licenca
      for (let i = 0; i < qtd; i++) {
        const chave = await LicenseController.generateKey(id_purchase);

        if (chave !== "") {
          console.log("chave gerada: ", chave);

          const con = await pool.getConnection();

          try {
            // Execute a inserção da nova licenca
            const [result] = await con.query(
              "INSERT INTO licenses (purchase_id, active, activated, license_key, start_date, end_date, valid_days, fingerprint) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [id_purchase, 1, 0, chave, null, null, validade, null]
            );

            // Verifique se a inserção foi bem-sucedida
            if (result.affectedRows === 1) {
              console.log("License cadastrada com sucesso.");

              const licenseAdded = {
                id: result.insertId, // O ID gerado para a nova license
                purchase_id: id_purchase,
                active: 1,
                activated: 0,
                license_key: chave,
                start_date: null,
                end_date: null,
                valid_days: validade,
                fingerprint: null,
              };

              if (licenseAdded) {
                // realizar vinculo entre licenca vendida com usuario vendedor
                const vincular = await LicenseSoldController.vincularLicenca(
                  idUserVendedor,
                  licenseAdded.id
                );
                if (vincular) {
                  contador++;
                }
                if (contador === qtd) {
                  return licenseInserida;
                }
              }
            } else {
              return null; // Retorna null se a inserção falhou
            }
          } catch (e) {
            console.error("Erro na inserção da license:", e);
            throw e;
          } finally {
            con.release(); // Libere a conexão de volta para o pool
          }
        }
      }
    } catch (e) {
      console.log("Aconteceu um erro: ", e);
      return;
    }
  }

  // versao mysql
  static async buscarLicense(coluna, valor) {
    const con = await pool.getConnection();

    try {
      const [linhas] = await con.query(
        `SELECT * FROM licenses WHERE ${coluna} = ?`,
        [valor]
      );

      if (linhas.length === 0) {
        return null; // Retorna null se a licenca não for encontrada
      }

      const licenca = linhas[0];
      return licenca;
    } catch (e) {
      console.error("Erro na busca da licenca:", e);
      throw e;
    } finally {
      con.release(); // Libere a conexão de volta para o pool
    }
  }

  static async ativarLicense(id, dataInicio, dataFim, fingerprint) {
    const con = await pool.getConnection();

    try {
      const [linhas] = await con.query(
        "UPDATE licenses SET activated = ?, start_date = ?, end_date = ?, fingerprint = ? WHERE id = ?",
        [1, dataInicio, dataFim, fingerprint, id]
      );

      if (linhas.length === 0) {
        return null; // Retorna null se a licenca não for ativada
      }

      const licenca = linhas.affectedRows;
      return licenca;
    } catch (e) {
      console.error("Erro ao ativar a licenca:", e);
      throw e;
    } finally {
      con.release(); // Libere a conexão de volta para o pool
    }
  }
}

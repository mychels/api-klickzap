import pool from "../config/dbConnect.js";

export default class UsuarioModel {
  static async cadastrarUsuario(user_code, name, email, phone_number, cpf) {
    const con = await pool.getConnection();

    try {
      // Execute a inserção do novo usuário
      const [result] = await con.query(
        "INSERT INTO users (user_code, name, email, phone_number, cpf) VALUES (?, ?, ?, ?, ?)",
        [user_code, name, email, phone_number, cpf]
      );

      // Verifique se a inserção foi bem-sucedida
      if (result.affectedRows === 1) {
        console.log("Usuario cadastrado com sucesso.");

        const userAdded = {
          id: result.insertId, // O ID gerado para o novo usuário
          user_code,
          name,
          email,
          phone_number,
          cpf,
        };
        return userAdded;
      } else {
        return null; // Retorna null se a inserção falhou
      }
    } catch (e) {
      console.error("Erro na inserção do usuário:", e);
      throw e;
    } finally {
      con.release(); // Libere a conexão de volta para o pool
    }
  }

  static async buscarUsuario(coluna, valor) {
    const con = await pool.getConnection();

    try {
      const [linhas] = await con.query(
        `SELECT * FROM users WHERE ${coluna} = ?`,
        [valor]
      );

      if (linhas.length === 0) {
        return null; // Retorna null se o usuário não for encontrado
      }

      const usuario = linhas[0];
      return usuario;
    } catch (e) {
      console.error("Erro na busca de usuário:", e);
      throw e;
    } finally {
      con.release(); // Libere a conexão de volta para o pool
    }
  }
}

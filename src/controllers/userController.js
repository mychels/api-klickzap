import user from "../models/User.js";

export default class UserController {
  static async cadastrarUser(param) {
    try {
      const data = param;

      if (data) {
        if (
          data.hasOwnProperty("full_name") &&
          data.hasOwnProperty("email") &&
          data.hasOwnProperty("CPF") &&
          data.hasOwnProperty("mobile")
        ) {
          const userCode = await UserController.generateUserCode(24);

          const newUser = await user.cadastrarUsuario(
            userCode,
            data.full_name,
            data.email,
            data.mobile,
            data.CPF
          );
          return newUser;
        }
      } else {
        console.log("Erro ao tentar cadastrar um cliente");
        return false;
      }
    } catch (e) {
      console.log("Erro ao tentar cadastrar um cliente", e);
      return false;
    }
  }

  static async generateUserCode(tamanho) {
    const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
    let resultado = "";

    for (let i = 0; i < tamanho; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres.charAt(indiceAleatorio);
    }
    return resultado;
  }

  static async buscarUsuario(coluna, value) {
    try {
      const usuario = await user.buscarUsuario(coluna, value);
      if (usuario) {
        console.log("Usuário encontrado:", usuario);
        return usuario;
      } else {
        console.log("Usuário não encontrado.");
        return;
      }
    } catch (e) {
      console.log("Erro:", e);
    }
  }
}

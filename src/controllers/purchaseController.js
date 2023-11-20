import purchase from "../models/Purchase.js";
import LicenseControler from "./licenseController.js";
import UserController from "./userController.js";
import crypto from "crypto";

export default class PurchaseController {
  static async cadastrarPurchase(req, res) {
    try {
      // validar compra
      //const resultado = await PurchaseController.validarPurchase(req); // comentar para testes iniciais
      const resultado = true; // comentar quando realmente tiver em producao
      const { userauth } = req.query;

      const userVendedor = await PurchaseController.buscarUsuario(userauth);

      console.log("Usuario na classe purchase: ", userVendedor);

      if (resultado && userVendedor) {
        console.log("Usuario na classe purchase: ", userVendedor);
        const data = req.body;
        const idUserVendedor = userVendedor.id;
        //const nomePlano = data.Subscription.plan.name;

        if (req.body.order_status == "paid") {
          // cadastrar primeiro usuario
          const user = await UserController.cadastrarUser(data.Customer);
          let idPurchaseCadastrada = null;
          let newPurchase = null;

          if (user) {
            // Texto inicial
            var nomePlano = data.Subscription.plan.name;

            // Dividir o texto com base no caractere "-"
            var partes = nomePlano.split(" - ");

            // Extrair o número da parte 1 usando expressão regular
            var numeroParte1 = partes[0].match(/\d+/); // Isso irá retornar um array de correspondências

            // Se houver uma correspondência, pega o primeiro elemento (o número)
            var numeroExtraido = numeroParte1
              ? parseInt(numeroParte1[0])
              : null;

            // Exibindo o número extraído
            console.log("Número extraído da parte 1: ", numeroExtraido);

            // Agora, partes[0] conterá "20 Licenças" e partes[1] conterá "Anual"
            var parte1 = partes[0];
            var parte2 = partes[1];

            // Exibindo as partes
            console.log("Parte 1:", parte1);
            console.log("Parte 2:", parte2);

            var validade = 0;
            if (parte2 === "Vitalicio") {
              validade = 9999;
            } else if (parte2 === "Anual") {
              validade = 365;
            } else {
              validade = 30;
            }

            newPurchase = await purchase.cadastrarPurchase(
              user.id,
              data.order_ref,
              data.order_status,
              data.payment_method,
              data.created_at,
              numeroExtraido
            );
          }

          if (newPurchase) {
            res.status(200).json({
              //message: "cadastrado com sucesso",
              //purchase: newPurchase,
              status: "ok",
            });

            // gerar licensas
            const addLicense = await LicenseControler.cadastrarLicense(
              newPurchase.id,
              numeroExtraido,
              idUserVendedor,
              validade
            );
          }
        }
      } else {
        return res.status(400).json({ error: "Incorrect signature" });
      }
    } catch (e) {
      res.status(500).json({ message: `${e.message} - erro no servidor` });
    }
  }

  static async validarPurchase(req) {
    const secret = "f5ru36x5vgx";

    // receive order's data
    let order = {};
    try {
      order = JSON.parse(req.body);
    } catch (error) {
      //return res.status(400).send({ error });
      return false;
    }

    const { signature } = req.query;
    //const signature = ""; // para teste
    const calculatedSignature = crypto
      .createHmac("sha1", secret)
      .update(JSON.stringify(order))
      .digest("hex");

    console.log("Received order: ", order);
    console.log("signature: ", signature);
    console.log("calculatedSignature: ", calculatedSignature);

    if (signature !== calculatedSignature) {
      return false;
    } else {
      return true;
    }
  }

  static async buscarUsuario(userauth) {
    try {
      console.log("Iniciando busca.");
      const value = await UserController.buscarUsuario("user_code", userauth);
      console.log("Terminou busca.", value);
      return value;
    } catch (e) {
      console.log("Erro:", e);
    }
  }
}

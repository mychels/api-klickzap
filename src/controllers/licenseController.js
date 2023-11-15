import license from "../models/License.js";
import crypto from "crypto";

export default class LicenseController {
  static async cadastrarLicense(id_purchase, qtd, idUserVendedor) {
    try {
      const newLicense = await license.cadastrarLicense(
        id_purchase,
        qtd,
        idUserVendedor
      );
      return newLicense;
    } catch (e) {
      console.log("Aconteceu um erro: ", e);
      return;
    }
  }

  static async gerarStringAleatoria(tamanho) {
    const caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
    let resultado = "";

    for (let i = 0; i < tamanho; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres.charAt(indiceAleatorio);
    }

    return resultado;
  }

  static async generateKey(id) {
    try {
      const stringAleatoria = await this.gerarStringAleatoria(10);
      console.log("valor aleatorio: ", stringAleatoria);
      const idModificado = id + stringAleatoria;
      console.log("idmodificado: ", idModificado);
      const dados = process.env.CHAVE_MESTRA_STRING + idModificado;
      const hash = crypto.createHash("sha256");
      hash.update(dados);
      const chave = hash.digest("hex");

      return chave;
    } catch (e) {
      console.log("Erro ao tentar gerar uma chave: ", e);
      return "";
    }
  }

  static async formatDate(date) {
    try {
      const fusoHorarioDesejado = "America/Sao_Paulo";

      // Cria um objeto de formatação de data e hora com o fuso horário desejado
      const opcoesDeFormatacao = { timeZone: fusoHorarioDesejado };
      const formatador = new Intl.DateTimeFormat("default", opcoesDeFormatacao);

      // Formata a data atual no fuso horário desejado
      const dataFormatada = formatador.format(date);
      return dataFormatada;
    } catch (e) {
      console.log("Erro: ", e);
    }
  }

  static async activateLicense(req, res) {
    try {
      const data = req.body;
      const chave = data.key;
      const fingerprint = data.fingerprint;

      if (chave !== "" && fingerprint !== "") {
        const licenseFound = await license.findOne({ key: chave }).exec();

        if (licenseFound) {
          const id = licenseFound._id;
          const qtdDias = licenseFound.valid_days;
          const dataInicio = new Date();
          let dataFim = new Date();
          dataFim = await LicenseController.calcularDataLimite(
            dataInicio,
            qtdDias
          );

          //console.log("data: ", dataInicioFormat);
          //console.log("data: ", dataFimFormat);

          const licenca = {
            activated: true,
            start_date: dataInicio,
            end_date: dataFim,
            fingerprint: fingerprint,
          };

          // ativando licenca
          const retorno = await license.findByIdAndUpdate(id, licenca);
          res
            .status(200)
            .json({ message: "licenca ativada com sucesso", retorno });
        } else {
          res.status(400).json({ message: "licenca nao existe" });
        }
      } else {
        res.status(400).json({ message: "erro ao tentar ativar licenca" });
      }
    } catch (e) {
      console.log("Aconteceu um erro: ", e);
      res.status(500).json({ message: "aconteceu um erro", e });
    }
  }

  static async calcularDataLimite(data, dias) {
    let dataResultante = new Date(data);
    if (dias === 999) {
      dataResultante.setFullYear(dataResultante.getFullYear() + 100);
    } else {
      dataResultante.setDate(dataResultante.getDate() + dias);
    }
    return dataResultante;
  }
}

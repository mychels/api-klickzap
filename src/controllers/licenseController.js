import license from "../models/License.js";
import crypto from "crypto";
import moment from "moment-timezone";

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

  static async formatDateOld(date) {
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

  static async formatDate(date) {
    try {
      const fusoHorarioDesejado = "America/Sao_Paulo";

      // Cria uma instância do Moment com a data e o fuso horário desejado
      const dataFormatada = moment(date).tz(fusoHorarioDesejado).format();

      return dataFormatada;
    } catch (e) {
      console.log("Erro: ", e);
    }
  }

  static async activateLicense(req, res) {
    try {
      const data = req.body;
      const chave = data.LicenseKey;
      const fingerprint = data.Fingerprint;

      if (chave !== "" && fingerprint !== "") {
        const licenseFound = await license.findOne({ key: chave }).exec();

        if (licenseFound) {
          const id = licenseFound.id;
          const qtdDias = licenseFound.valid_days;

          const dataInicio = new Date();
          const dataInicioFormatada = await LicenseController.formatDate(
            dataInicio
          );
          let dataFim = new Date();
          dataFim = await LicenseController.calcularDataLimite(
            dataInicioFormatada,
            qtdDias
          );
          const dataFimFormatada = await LicenseController.formatDate(dataFim);

          //console.log("data: ", dataInicioFormat);
          //console.log("data: ", dataFimFormat);

          const licenca = {
            activated: true,
            start_date: dataInicioFormatada,
            end_date: dataFimFormatada,
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

  // versao mysql
  static async buscarLicenca(LicenseKey) {
    try {
      const licenca = await license.buscarLicense("license_key", LicenseKey);
      if (licenca) {
        console.log("Licenca encontrada:", licenca);
        return licenca;
      } else {
        console.log("Licenca não encontrada.");
        return;
      }
    } catch (e) {
      console.log("Erro:", e);
    }
  }

  static async ativarLicenca(req, res) {
    try {
      const data = req.body;
      const licenca = await LicenseController.buscarLicenca(data.LicenseKey);
      if (licenca) {
        const dataInicio = new Date();
        const dataInicioFormatada = await LicenseController.formatDate(
          dataInicio
        );
        let dataFim = new Date();
        const qtdDias = licenca.valid_days;
        dataFim = await LicenseController.calcularDataLimite(
          dataInicioFormatada,
          qtdDias
        );
        const dataFimFormatada = await LicenseController.formatDate(dataFim);

        console.log("data inicio: ", dataInicioFormatada);

        const ativada = await license.ativarLicense(
          licenca.id,
          dataInicioFormatada,
          dataFimFormatada,
          data.Fingerprint
        );

        if (ativada) {
          res.status(200).json({
            status: "ok",
            StartDate: dataInicioFormatada,
            EndDate: dataFimFormatada,
            validDays: qtdDias,
          });
          console.log("Retorno: ", ativada);
        }
      } else {
        console.log("Licenca não existe.");
        res.status(400).json({
          status: "licenca nao existe",
          validDays: 0,
        });
      }
    } catch (e) {
      console.log("Erro:", e);
    }
  }
}

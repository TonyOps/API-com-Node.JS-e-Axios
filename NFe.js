import { post } from "axios";
import { sign } from "jsonwebtoken";

const chaveAcesso = "SUA_CHAVE_DE_ACESSO";
const certificadoDigital = "CAMINHO_PARA_CERTIFICADO_DIGITAL";
const senhaCertificado = "SENHA_DO_CERTIFICADO_DIGITAL";

function gerarToken(cnpjEmissor, chavePrivada) {
  const token = sign({ cnpjEmissor }, chavePrivada, { algorithm: "RS256" });
  return token;
}

async function consultarDadosFiscais(chaveAcesso, token) {
  try {
    const url = "URL_DA_API_DA_FAZENDA";
    const payload = { chaveAcesso };

    const response = await post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent: {
        cert: certificadoDigital,
        key: certificadoDigital,
        passphrase: senhaCertificado,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao consultar dados fiscais:", error.response.data);
    throw error;
  }
}

async function main() {
  const cnpjEmissor = "CNPJ_DO_EMISSOR";
  const chavePrivada = "CHAVE_PRIVADA_DO_EMISSOR";

  const token = gerarToken(cnpjEmissor, chavePrivada);

  try {
    const dadosFiscais = await consultarDadosFiscais(chaveAcesso, token);
    console.log("Dados fiscais:", dadosFiscais);
  } catch (error) {
    console.error("Erro ao consultar dados fiscais:", error);
  }
}

main();

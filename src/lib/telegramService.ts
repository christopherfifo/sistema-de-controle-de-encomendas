import axios from "axios";

interface DadosNotificacaoRetirada {
  chatId: string;
  moradorNome: string;
  bloco: string;
  apartamento: string;
  tipoEncomenda: string;
  formaEntrega: string;
  codigoRastreio?: string | null;
  dataRetirada: Date;
  quemRetirouNome: string;
  urlFotoProduto?: string | null;
}

export async function enviarNotificacaoRetiradaTelegram(
  dados: DadosNotificacaoRetirada,
): Promise<boolean> {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  if (!BOT_TOKEN) {
    console.error(
      "[TELEGRAM_SERVER_ERROR] O TELEGRAM_BOT_TOKEN não está definido nas variáveis de ambiente (.env).",
    );
    return false;
  }

  const horaFormatada = dados.dataRetirada.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dataFormatada = dados.dataRetirada.toLocaleDateString("pt-BR");

  const textoMensagem = [
    `✅ *CondoDrop — Encomenda Retirada!*`,
    ``,
    `Olá, *${dados.moradorNome}*! Sua encomenda foi liberada na portaria.`,
    ``,
    `📦 *Detalhes da Encomenda:*`,
    `• *Tipo:* ${dados.tipoEncomenda}`,
    `• *Origem/Forma:* ${dados.formaEntrega}`,
    dados.codigoRastreio ? `• *Rastreio:* \`${dados.codigoRastreio}\`` : null,
    `• *Unidade:* ${dados.bloco} — Apt ${dados.apartamento}`,
    ``,
    `🤝 *Informações da Entrega:*`,
    `• *Retirado por:* ${dados.quemRetirouNome}`,
    `• *Horário:* ${horaFormatada} do dia ${dataFormatada}`,
    ``,
    `_Caso você não reconheça esta ação, entre em contato imediatamente com a administração do condomínio._`,
  ]
    .filter((linha) => linha !== null)
    .join("\n");

  try {
    if (dados.urlFotoProduto) {
      const telegramFormData = new FormData();
      telegramFormData.append("chat_id", dados.chatId);
      telegramFormData.append("caption", textoMensagem);
      telegramFormData.append("parse_mode", "Markdown");

      if (
        typeof dados.urlFotoProduto === "string" &&
        dados.urlFotoProduto.startsWith("data:")
      ) {
        const fetchRes = await fetch(dados.urlFotoProduto);
        const blob = await fetchRes.blob();
        telegramFormData.append("photo", blob, "produto.jpg");
      } else {
        telegramFormData.append("photo", dados.urlFotoProduto);
      }

      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
        {
          method: "POST",
          body: telegramFormData,
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error(
          "[TELEGRAM_API_ERROR] Falha ao enviar foto na retirada:",
          errorData,
        );
      }
    } else {
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: dados.chatId,
        text: textoMensagem,
        parse_mode: "Markdown",
      });
    }

    return true;
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error(
      "[TELEGRAM_API_ERROR] Falha ao enviar mensagem para o chat_id:",
      dados.chatId,
      err?.response?.data || err.message,
    );
    return false;
  }
}

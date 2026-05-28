import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get("codigo")?.toUpperCase().trim();

  if (!codigo) {
    return NextResponse.json({ valido: false });
  }

  try {
    // API Pública, Gratuita e Aberta da comunidade para rastreio de objetos nos Correios
    const resposta = await fetch(
      `https://api.linketrack.com/track/json?user=teste&token=1abcd1234567890abcdef&codigo=${codigo}`,
      { next: { revalidate: 3600 } } // Cache de 1 hora para evitar requisições repetidas ao mesmo código
    );

    if (resposta.status === 200) {
      const dados = await resposta.json();
      return NextResponse.json({ 
        valido: true, 
        servico: "Correios", 
        quantidade_eventos: dados.quantidade || 0 
      });
    }

    return NextResponse.json({ valido: false });
  } catch (error) {
    console.error("Falha ao consultar API de Rastreio:", error);
    return NextResponse.json({ valido: false });
  }
}
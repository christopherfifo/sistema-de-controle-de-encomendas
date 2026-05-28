import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get("codigo")?.toUpperCase().trim();

  if (!codigo) {
    return NextResponse.json({ valido: false });
  }

  try {
    const resposta = await fetch(
      `https://mock-correios-api.vercel.app/api/rastreio/${codigo}`,
      { next: { revalidate: 3600 } }
    );

    if (resposta.status === 200) {
      const dados = await resposta.json();
      return NextResponse.json(dados);
    }

    return NextResponse.json({ valido: false });
  } catch (error) {
    console.error("Falha ao consultar API de Rastreio Mock:", error);
    return NextResponse.json({ valido: false });
  }
}
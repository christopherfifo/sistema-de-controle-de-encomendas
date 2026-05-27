import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "@/lib/prisma";

type GetOrCreateTokenOptions = {
  userId: string;
  formatted?: boolean;
  length?: number;
  prisma?: PrismaClient | Prisma.TransactionClient;
};

export async function getOrCreateUserToken({
  userId,
  formatted = false,
  length = 8,
  prisma = db,
}: GetOrCreateTokenOptions): Promise<string> {
  const user = await prisma.usuario.findUnique({
    where: {
      id_usuario: userId,
    },
    select: {
      token_acesso: true,
    },
  });

  if (user?.token_acesso) {
    return formatted
      ? formatToken(user.token_acesso)
      : user.token_acesso;
  }

  let token = "";
  let exists = true;

  while (exists) {
    token = generateNumericToken(length);

    const existingToken = await prisma.usuario.findFirst({
      where: {
        token_acesso: token,
      },
      select: {
        id_usuario: true,
      },
    });

    exists = !!existingToken;
  }

  await prisma.usuario.update({
    where: {
      id_usuario: userId,
    },
    data: {
      token_acesso: token,
    },
  });

  return formatted
    ? formatToken(token)
    : token;
}

function generateNumericToken(length: number): string {
  const numbers = "0123456789";

  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex =
      crypto.getRandomValues(new Uint32Array(1))[0] % numbers.length;

    token += numbers[randomIndex];
  }

  return token;
}

function formatToken(token: string): string {
  if (token.length === 8) {
    return `${token.slice(0, 4)}-${token.slice(4, 8)}`;
  }

  if (token.length === 6) {
    return `${token.slice(0, 3)}-${token.slice(3, 6)}`;
  }

  return token;
}
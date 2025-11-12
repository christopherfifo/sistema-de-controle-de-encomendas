import { PrismaClient, PerfilUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o script de seed...");

  console.log("Limpando dados existentes...");

  await prisma.moradoresUnidades.deleteMany();
  await prisma.unidade.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.condominio.deleteMany();
  await prisma.plano.deleteMany();

  const hashedPassword = await bcrypt.hash("Casa#2459", 10);
  console.log("Senha criptografada.");

  const plano = await prisma.plano.create({
    data: {
      nome_plano: "Plano Light",
      valor: 99.9,
      limite_unidades: 50,
      limite_usuarios: 200,
      limite_condominios: 1,
    },
  });
  console.log(`Plano "${plano.nome_plano}" criado.`);

  const condominio = await prisma.condominio.create({
    data: {
      nome_condominio: "Residencial Pequeno Príncipe",
      cnpj: "95489660000194",
      logradouro: "Rua das Acácias",
      numero: "123",
      bairro: "Centro",
      cidade: "Curitiba",
      uf: "PR",
      qtd_unidades: 24,
      qtd_blocos_torres: 4,
      id_plano: plano.id_plano,
    },
  });
  console.log(`Condomínio "${condominio.nome_condominio}" criado.`);

  const sindico = await prisma.usuario.create({
    data: {
      nome_completo: "Síndico Admin",
      email: "sindico@gmail.com",
      cpf: "68282302058",
      telefone: "41912345678",
      senha_hash: hashedPassword,
      perfil: PerfilUsuario.SINDICO,
      id_condominio: condominio.id_condominio,
    },
  });
  console.log(`Usuário Síndico "${sindico.nome_completo}" criado.`);

  console.log("Iniciando criação das unidades...");
  const blocos = ["A", "B", "C", "D"];
  const apartamentos: string[] = [];

  for (let andar = 1; andar <= 2; andar++) {
    for (let num = 1; num <= 3; num++) {
      apartamentos.push(`${andar}0${num}`);
    }
  }

  for (const bloco of blocos) {
    const dadosUnidades = apartamentos.map((apto) => {
      return {
        id_condominio: condominio.id_condominio,
        bloco_torre: `Bloco ${bloco}`,
        numero_unidade: apto,
      };
    });

    await prisma.unidade.createMany({
      data: dadosUnidades,
    });
    console.log(`--- 6 unidades do Bloco ${bloco} criadas.`);
  }

  console.log("Seed concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro durante a execução do seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

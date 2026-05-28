const { rastrearEncomendas } = require('correios-brasil');

async function main() {
  const rastreio = await rastrearEncomendas(['AD466192491BR']);
  console.log(JSON.stringify(rastreio, null, 2));
}

main().catch(console.error);

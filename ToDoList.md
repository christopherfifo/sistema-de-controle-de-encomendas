# tarefas primarias

## gabriel

- [x] Criar a função que crie o token para cada usuário quando ele fizer o cadastro (interessante essa função ser separada)
- [x] arrumar a logica dos formulários de cadastro e login para usar a api e redirecionar se estiver certo
- [x] criar a aba onde exibi o token do usuário
- [x] fluxo de recupeção de senha dos usuários com envio de email

## chris

- [x] criar a aba de adm para cadastrar ponteiros e tirar
- [x] api do telegram para noticiar o usuário
- [x] campo para p usuário colocar o id do telegram
- [x] validação do token na hora da encomenda com acesso a camera para ler o token

# essencial

- [x] verificar se a api de rastreio dos correios esta funcionando
- [x] deixar o formulario de cadasto de encomendas no mesmo formato que o do porteiro e usar a api do codigo de rastreio (mas sem o campo de foto e pesquisa por nome, mas ele deve pegar o bloco de apartamento sozinho)
- [x] na aba de aviso dos moradores (encomendas pré cadastradas), ele so ta puxando uma pessoa (yasmin) ao invés de todos as pessoas

# tarefas secundarias

- [x] arrumar a tela de home do projeto
- [x] criar a pagina de contratação do sistema
- [x] criar o sistema de cadastro e validação dos cartoes
- [x] sistema de pagamento
- [x] tela de planos com descrição para cada um
- [X] quando criamos uma encomenda e pesquisamos o usuario pelo nome, ele seleciona 2 vezes
- [X] a aba de encomendas pendentes (avisos de moradores) do porteiro não sincroniza com a mudança no banco de dados
- [X] arrumar a aba de retirada de encomendas do porteiro, ta puxando varias pessoas para uma encomenda
- [X] permitir cadastro de síndico na tela administrativa (após contratação do sistema)
- [X] criar página de termos de uso (moradores/porteiro/síndico)
- [X] criar página de termos de uso (contratação)
- [ ] na parte do porteiro, onde tem a lista de retirada, ele ta contanto a quantidade errada, não sei se é por causa das criadas pelo seed
- [ ] nas abas de gerenciar funcionario e sindico, colocar uma opção de desvincular eles como funcionario
- [ ] tela do dono da empresa
- [X] criar as abas do adm, ele vai ter todas as abas dos outros usuarios (porteiro, morador, sindico) além da aba do plano, upgrade, pagamentos, faturas, formas de pagamento e cadastro de sindico
- [X] lapidar cada aba e terminar de desenvolver elas, por exemplo, no historico do porteiro ele não puxa o historico por cada porteiro e tem um campo de meus registros, mas o adm não faz isso
- o sindico tem que ter acesso ao historico dos porteiros, tem que criar aba
- [x] adicionar botões de "concordo com os termos de uso" e salvar no banco
- [x] na hora inserir o codigo do condominio, selecionar automaticamente os blocos e apartamentos disponiveis
- [x] mostrar mensagens de erro da API no cadastro de morador
- [x] api externa de validação de cpf
- [x] api externa de pagamento
- [x] api externa de envio de emails
- [x] melhorar o seed do projeto
- [x] permitir enviar link de cadastro com código de acesso pré-preenchido via URL
- [x] arrumar botão de logoff (só aparecendo quando a barra lateral está aberta, e meio quebrado com o layout)
- [x] adicionar identidade visual geral na aplicação
- [x] adicionar favicon e ajustar nome da aba
- [ ] enviar email ao morador ao chegar uma encomenda (além da notificação do telegram)
- [x] arrumar todos os erros de lint do projeto
- [x] adicionar botão para trocar o tema da aplicação

no historico global eu preciso saber também quem cadastrol (os dados do morador) e os dados da moradia bloco e apt. além disso, quero lago visualmente mais bonito e facil de ler. quero também um botão que permita eu mudar o modo de exibição para alinhar por bloco familiar

no historioco da portaria tem o problema do campo meus registros, mas o adm não da baixa, além disso eu preciso de mais uma maneira de filtro, porque ali vai ter vez que eu vou querer pegar o historico de um porteiro especifico. eu preciso saber também quem cadastrol (os dados do morador) e os dados da moradia bloco e apt. além disso, quero lago visualmente mais bonito e facil de ler.
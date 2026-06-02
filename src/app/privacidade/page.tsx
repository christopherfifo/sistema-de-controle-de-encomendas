import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function PrivacidadePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto py-16 px-4 md:px-8 max-w-4xl flex-grow">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Política de Privacidade</h1>
        
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-6">
          <p>
            No <strong>CondoDrop</strong>, a privacidade e a segurança dos dados dos condomínios, porteiros e moradores são prioridade máxima. Esta Política de Privacidade descreve como coletamos, armazenamos e utilizamos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Coleta de Dados Pessoais</h2>
          <p>Para o funcionamento adequado do sistema de encomendas, coletamos as seguintes categorias de dados:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Moradores:</strong> Nome completo, CPF, e-mail, telefone, bloco/torre, número do apartamento e ID de usuário no Telegram (caso habilitado).</li>
            <li><strong>Porteiros e Síndicos:</strong> Nome completo, CPF, e-mail, telefone e informações de vínculo empregatício com o condomínio contratante.</li>
            <li><strong>Imagens:</strong> Fotografias de pacotes registradas durante o processo de entrada para comprovação do estado da entrega.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Uso das Informações</h2>
          <p>Os dados coletados têm a finalidade exclusiva de:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Identificar unívoca e corretamente os destinatários de cada encomenda;</li>
            <li>Enviar notificações em tempo real (via plataforma, e-mail ou Telegram) sobre chegadas e retiradas;</li>
            <li>Permitir o controle de acesso e de permissões de síndicos e porteiros na plataforma;</li>
            <li>Registrar um histórico de auditoria seguro para a gestão do próprio condomínio.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Compartilhamento de Dados</h2>
          <p>
            Nós <strong>não vendemos, alugamos ou comercializamos</strong> seus dados pessoais com terceiros em nenhuma hipótese. O compartilhamento ocorre estritamente:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Com o próprio condomínio contratante e seus administradores, dentro da relação direta do serviço;</li>
            <li>Com fornecedores de tecnologia essenciais (ex: provedores de e-mail e servidores em nuvem), que atuam sob rígidos contratos de confidencialidade;</li>
            <li>Para o cumprimento de determinações legais ou ordens judiciais.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Segurança da Informação</h2>
          <p>
            Utilizamos medidas técnicas e administrativas, como criptografia de senhas (hashing) e conexões seguras (HTTPS/SSL), para proteger os dados contra acessos não autorizados. No entanto, é responsabilidade do usuário proteger suas credenciais de acesso e os códigos de retirada de encomendas.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Direitos do Titular (LGPD)</h2>
          <p>
            Você tem o direito de solicitar o acesso, a correção ou a exclusão dos seus dados pessoais. Moradores devem solicitar alterações diretamente à administração do condomínio (Síndico), que é o controlador dos dados no contexto do serviço CondoDrop.
          </p>

          <p className="mt-12 text-sm">
            <em>Última atualização: {new Date().toLocaleDateString('pt-BR')} (Projeto Acadêmico - Simulação)</em>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
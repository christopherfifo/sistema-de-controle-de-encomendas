import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function TermosPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto py-16 px-4 md:px-8 max-w-4xl flex-grow">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Termos de Serviço</h1>
        
        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-6">
          <p>
            Bem-vindo ao <strong>CondoDrop</strong>. Ao utilizar nosso sistema de controle de encomendas e gestão condominial, você concorda expressamente com os termos descritos abaixo. Leia-os atentamente antes de prosseguir.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p>
            O uso dos serviços oferecidos pelo CondoDrop (&quot;Nós&quot;, &quot;Nossa Plataforma&quot;) pelo condomínio contratante (&quot;Cliente&quot;), seus administradores, porteiros e moradores (&quot;Usuários&quot;) está condicionado à aceitação deste Termo de Serviço. Caso não concorde com alguma cláusula, o uso do sistema deverá ser descontinuado.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Descrição do Serviço</h2>
          <p>
            O CondoDrop é uma plataforma de software como serviço (SaaS) voltada para a gestão de recebimento e entrega de encomendas, comunicação via mural de recados e integração com ferramentas de notificação (como o Telegram). Nós fornecemos a tecnologia, mas não nos responsabilizamos pela gestão física dos pacotes nas dependências do condomínio.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Responsabilidades do Usuário</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Síndico/Administrador:</strong> É responsável por gerenciar o cadastro de porteiros e moradores, bem como manter os pagamentos das faturas do sistema em dia para garantir o acesso ininterrupto.</li>
            <li><strong>Porteiro:</strong> Deve registrar as informações das encomendas de forma fidedigna e garantir que a retirada seja feita mediante verificação do código de retirada ou documento válido.</li>
            <li><strong>Morador:</strong> Compromete-se a fornecer dados reais (como CPF e número da unidade) para recebimento das notificações e deverá zelar pela segurança de seus códigos de retirada.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Limitação de Responsabilidade</h2>
          <p>
            O CondoDrop atua estritamente como um facilitador de registro e comunicação. Não nos responsabilizamos por extravios, danos, furtos ou violações de encomendas físicas que ocorram nas dependências do condomínio. A integridade física das entregas é de responsabilidade exclusiva da equipe local do condomínio.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Propriedade Intelectual</h2>
          <p>
            Todos os direitos sobre o software CondoDrop, sua marca, código-fonte, identidade visual e funcionalidades são de nossa propriedade exclusiva. A licença concedida ao condomínio é apenas de uso, sendo proibida a engenharia reversa, cópia ou distribuição não autorizada.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Alteração dos Termos</h2>
          <p>
            Podemos revisar estes Termos de Serviço periodicamente. O Cliente será notificado sobre quaisquer alterações significativas através da plataforma ou pelo e-mail do síndico. O uso contínuo após as alterações implica na aceitação dos novos termos.
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
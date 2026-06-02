import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { CheckCircle2, ShieldCheck, Activity } from "lucide-react";

export default function SLAPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <div className="container mx-auto py-16 px-4 md:px-8 max-w-5xl flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Acordo de Nível de Serviço (SLA)</h1>
          <p className="text-xl text-muted-foreground">O compromisso do CondoDrop com a disponibilidade e qualidade do seu sistema de gestão.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            <Activity className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2">Disponibilidade (Uptime)</h3>
            <p className="text-4xl font-extrabold text-green-600 mb-2">99.9%</p>
            <p className="text-sm text-muted-foreground">Garantia de funcionamento da plataforma mensalmente.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2">Notificações</h3>
            <p className="text-4xl font-extrabold text-blue-600 mb-2">&lt; 3min</p>
            <p className="text-sm text-muted-foreground">Tempo médio para disparo de avisos via E-mail e Telegram.</p>
          </div>
          
          <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
            <ShieldCheck className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-lg font-bold mb-2">Backups</h3>
            <p className="text-4xl font-extrabold text-purple-600 mb-2">Diário</p>
            <p className="text-sm text-muted-foreground">Cópias de segurança de todos os registros e logs de encomendas.</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-muted-foreground space-y-6">
          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Cobertura do SLA</h2>
          <p>
            O presente Acordo de Nível de Serviço abrange a infraestrutura principal do CondoDrop, o que inclui a área do síndico, a aplicação da portaria e a visibilidade para o morador. Problemas de instabilidade originados por provedores terceiros (como falhas na API do Telegram ou serviços dos Correios) não contabilizam como tempo de inatividade da nossa plataforma.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Tempo de Resposta de Suporte</h2>
          <p>O tempo de resposta da equipe técnica varia conforme o plano contratado pelo condomínio:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Planos Light e Profissional:</strong> Resposta inicial em até 24 horas úteis (via ticket e-mail).</li>
            <li><strong>Plano Premium:</strong> Suporte Prioritário com resposta inicial em até 4 horas úteis.</li>
            <li><strong>Plano Enterprise / Personalizado:</strong> Suporte Dedicado com resposta em até 1 hora útil e contato direto via telefone/WhatsApp.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Manutenções Programadas</h2>
          <p>
            Atualizações de versão e correções de banco de dados são agendadas para horários de menor fluxo (tradicionalmente entre as 02h00 e 05h00 da manhã, horário de Brasília). O síndico administrador receberá um e-mail com pelo menos 48 horas de antecedência caso a manutenção preveja a indisponibilidade total do painel do porteiro.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Compensação por Quedas (Créditos)</h2>
          <p>
            Caso a disponibilidade mensal da plataforma seja inferior aos 99.9% prometidos, o condomínio contratante terá o direito de solicitar crédito na fatura do mês subsequente, conforme a tabela abaixo:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Entre 99.0% e 99.89%: Crédito de 10% do valor da mensalidade.</li>
            <li>Entre 95.0% e 98.9%: Crédito de 25% do valor da mensalidade.</li>
            <li>Menos de 95.0%: Crédito de 50% do valor da mensalidade.</li>
          </ul>

          <p className="mt-12 text-sm">
            <em>Este é um documento ilustrativo para o Projeto de Conclusão de Curso (Simulação Acadêmica).</em>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
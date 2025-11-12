import Image from "next/image";

const About = () => {
  return (
    <section className="mx-auto max-w-5xl space-y-8 px-6 py-20 text-center">
      <h2 className="text-3xl font-bold">Sobre o SysCondomínio</h2>
      <p className="text-gray-300 text-lg leading-relaxed">
        O <strong>SysCondomínio</strong> é um sistema inteligente de gestão de
        encomendas desenvolvido para modernizar o dia a dia dos condomínios. Ele
        simplifica a comunicação entre moradores, síndicos e porteiros,
        garantindo mais segurança, agilidade e organização em todo o processo de
        recebimento de pacotes.
      </p>

      <div className="grid grid-cols-1 gap-10 pt-10 sm:grid-cols-2">
        <div className="flex flex-col items-center text-center space-y-4">
          <Image
            src="/home2.png"
            alt="Registro de Encomendas"
            width={500}
            height={350}
            className="rounded-lg border border-white/10 shadow-lg"
          />
          <p className="text-gray-400">
            Registre e controle encomendas em poucos cliques, com total
            rastreabilidade e histórico de entregas.
          </p>
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          <Image
            src="/home3.png"
            alt="Segurança no Condomínio"
            width={500}
            height={350}
            className="rounded-lg border border-white/10 shadow-lg"
          />
          <p className="text-gray-400">
            Evite extravios e melhore a comunicação com alertas automáticos para
            cada morador.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative flex h-[90vh] w-full items-center justify-center">
      <Image
        src="/home1.png"
        alt="Gestão de Encomendas"
        fill
        className="object-cover opacity-50"
        priority
      />
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Seu Condomínio. Mais Seguro. <br /> Mais Conveniente.
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          A revolução na gestão de encomendas chegou.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 bg-white text-black hover:bg-gray-200"
        >
          <Link href="/login">SAIBA MAIS</Link>
        </Button>
      </div>
    </section>
  );
};

export default Hero;

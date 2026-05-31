import { Package } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-muted/50 pt-16 pb-8 border-t">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-500 p-1.5 rounded-md">
                <Package className="h-4 w-4 text-emerald-950" />
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">
                CondoDrop
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              O sistema definitivo para modernizar a portaria do seu condomínio,
              garantindo segurança e agilidade no controle de encomendas.
            </p>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Produto</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link
                href="#sobre"
                className="hover:text-emerald-500 transition-colors"
              >
                Funcionalidades
              </Link>
              <Link
                href="/planos"
                className="hover:text-emerald-500 transition-colors"
              >
                Planos
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Acesso</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link
                href="/login"
                className="hover:text-emerald-500 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastroMorador"
                className="hover:text-emerald-500 transition-colors"
              >
                Cadastro de Morador
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} CondoDrop. Todos os direitos
            reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/termos" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link
              href="/privacidade"
              className="hover:text-foreground transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { PackageCheck, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b-8 border-black bg-black/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <PackageCheck className="h-6 w-6 text-white" />
          <span className="text-lg font-semibold text-white">
            SysCondomínio
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <Button
            asChild
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white hover:text-black"
          >
            <Link href="/login">Login</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white hover:text-black"
          >
            <Link href="/cadastro">Cadastrar Condomínio</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white hover:text-black"
          >
            <Link href="/cadastroMorador">Cadastrar Morador</Link>
          </Button>
        </nav>

        <div className="md:hidden">
          <button
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMobileOpen((s) => !s)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-white hover:bg-white/10"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden origin-top-right transform transition-all duration-200 ease-in-out ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="w-full border-t border-black bg-black/95 px-4 pb-4 pt-3">
          <div className="flex flex-col gap-3">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-center bg-transparent text-white hover:bg-white/5"
              onClick={() => setMobileOpen(false)}
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-white bg-transparent text-white hover:bg-white hover:text-black"
              onClick={() => setMobileOpen(false)}
            >
              <Link href="/cadastro">Cadastrar Condomínio</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-white bg-transparent text-white hover:bg-white hover:text-black"
              onClick={() => setMobileOpen(false)}
            >
              <Link href="/cadastroMorador">Cadastrar Morador</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

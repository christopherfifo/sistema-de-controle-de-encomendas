"use client";

import { Package, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { RoleModal } from "./role-modal";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 py-3 shadow-lg" : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-500 p-1.5 rounded-md group-hover:bg-emerald-600 transition-colors shadow-sm">
            <Package className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            CondoDrop
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="#sobre" className="hover:text-white transition-colors">
            Como Funciona
          </Link>
          
          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            <Button
              asChild
              variant="ghost"
              className="text-white hover:bg-white/5 hover:text-white rounded-md"
            >
              <Link href="/login">Entrar</Link>
            </Button>

            <RoleModal>
              <Button
                className="bg-emerald-500 text-black hover:bg-emerald-600 rounded-md font-semibold transition-colors"
              >
                Começar Agora
              </Button>
            </RoleModal>
          </div>
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0A0A0A] border-b border-white/5 shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link 
            href="#sobre" 
            className="text-gray-300 hover:text-white py-2 font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Como Funciona
          </Link>
          
          <div className="h-px w-full bg-white/5 my-2"></div>

          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/5 rounded-md h-12"
            onClick={() => setMobileOpen(false)}
          >
            <Link href="/login">Entrar na Conta</Link>
          </Button>
          
          <RoleModal>
            <Button
              className="w-full justify-center bg-emerald-500 text-black hover:bg-emerald-600 rounded-md h-12 font-semibold"
            >
              Começar Agora
            </Button>
          </RoleModal>
        </div>
      )}
    </header>
  );
};

export default Navbar;

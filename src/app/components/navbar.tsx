"use client";

import { Package, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { RoleModal } from "./role-modal";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-500 p-1.5 rounded-md group-hover:bg-emerald-600 transition-colors shadow-sm">
            <Package className="h-5 w-5 text-emerald-950" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            CondoDrop
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#sobre" className="hover:text-foreground transition-colors">
            Como Funciona
          </Link>

          <div className="flex items-center gap-4 border-l border-border pl-8">
            <ThemeToggle variant="navbar" />

            <Button
              asChild
              variant="ghost"
              className="text-foreground hover:bg-accent rounded-md"
            >
              <Link href="/login">Entrar</Link>
            </Button>

            <RoleModal>
              <Button className="bg-emerald-500 text-emerald-950 hover:bg-emerald-600 rounded-md font-semibold transition-colors">
                Começar Agora
              </Button>
            </RoleModal>
          </div>
        </nav>

        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle variant="navbar" />
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link
            href="#sobre"
            className="text-muted-foreground hover:text-foreground py-2 font-medium"
            onClick={() => setMobileOpen(false)}
          >
            Como Funciona
          </Link>

          <div className="h-px w-full bg-border my-2"></div>

          <Button
            asChild
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-accent rounded-md h-12"
            onClick={() => setMobileOpen(false)}
          >
            <Link href="/login">Entrar na Conta</Link>
          </Button>

          <RoleModal>
            <Button className="w-full justify-center bg-emerald-500 text-emerald-950 hover:bg-emerald-600 rounded-md h-12 font-semibold">
              Começar Agora
            </Button>
          </RoleModal>
        </div>
      )}
    </header>
  );
};

export default Navbar;

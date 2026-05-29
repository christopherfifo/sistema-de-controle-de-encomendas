"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Building2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function RoleModal({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#0A0A0A] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Como você deseja acessar?
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Link
            href="/cadastroMorador"
            className="flex flex-col items-center justify-center p-6 border border-white/10 rounded-xl bg-[#111] hover:bg-[#1a1a1a] hover:border-emerald-500 transition-all group"
          >
            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
              <User className="h-8 w-8 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Sou Morador
            </h3>
            <p className="text-sm text-gray-400 text-center leading-relaxed">
              Quero me cadastrar para receber minhas encomendas.
            </p>
          </Link>

          <Link
            href="/planos"
            className="flex flex-col items-center justify-center p-6 border border-white/10 rounded-xl bg-[#111] hover:bg-[#1a1a1a] hover:border-emerald-500 transition-all group"
          >
            <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
              <Building2 className="h-8 w-8 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Sou Síndico
            </h3>
            <p className="text-sm text-gray-400 text-center leading-relaxed">
              Quero cadastrar meu condomínio no sistema.
            </p>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

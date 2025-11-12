"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Package, History, Menu, User, PackagePlus } from "lucide-react";

interface SimpleSidebarProps {
  userName: string;
  condominioId: string;
  userId?: string;
  perfil?: string;
  condominioName: string;
}

export function SimpleSidebar({
  userName,
  condominioId,
  userId,
  perfil,
  condominioName,
}: SimpleSidebarProps) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const createHref = (path: string) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (path === "/") {
      return `/${condominioId}?user=${userId}&perfil=${perfil}`;
    }
    return `/${condominioId}${cleanPath}?user=${userId}&perfil=${perfil}`;
  };

  const navItems = [
    {
      label: "Encomendas",
      href: createHref("/"),
      icon: Package,
      pathCheck: `/${condominioId}`,
    },
    {
      label: "Histórico",
      href: createHref("/historico"),
      icon: History,
      pathCheck: `/${condominioId}/historico`,
    },
    {
      label: "cadastro de Encomendas",
      href: createHref("/cadastroEncomendas"),
      icon: PackagePlus,
      pathCheck: `/${condominioId}/historico`,
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden md:flex flex-col border-r bg-background h-screen sticky top-0 z-50",
          "transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-20",
        )}
      >
        <div className="flex items-center p-4 h-14 border-b">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="shrink-0"
          >
            <Menu
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                !isOpen && "rotate-180",
              )}
            />
          </Button>

          <div
            className={cn(
              "overflow-hidden ml-2 transition-opacity duration-300",
              !isOpen ? "opacity-0 w-0" : "opacity-100 w-full",
            )}
          >
            <p className="text-base font-bold text-black wrap-break-words line-clamp-2 leading-tight">
              {" "}
              {condominioName}
            </p>
          </div>
        </div>

        <nav className="flex flex-col space-y-1 p-2 flex-1">
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant={
                    pathname === item.pathCheck ? "default" : "secondary"
                  }
                  className="justify-start gap-2"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className={cn(!isOpen && "sr-only")}>
                      {item.label}
                    </span>
                  </Link>
                </Button>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right">{item.label}</TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>

        <div
          className={cn(
            "p-4 border-t flex items-center",
            !isOpen && "justify-center",
          )}
        >
          <User className={cn("h-5 w-5 shrink-0", isOpen && "mr-2")} />
          <span
            className={cn(
              "font-medium whitespace-nowrap transition-opacity duration-300",
              !isOpen && "sr-only",
            )}
          >
            {userName}
          </span>
        </div>
      </aside>
    </TooltipProvider>
  );
}

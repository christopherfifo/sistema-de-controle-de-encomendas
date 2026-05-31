"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Package,
  History,
  Menu,
  User,
  PackagePlus,
  Settings,
  LogOut,
  LucideIcon,
  SquareChartGantt,
  ShieldAlert,
  ExternalLink,
  FolderKanban,
  IdCardLanyard,
} from "lucide-react";
import { PerfilUsuario } from "@prisma/client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  pathCheck: string;
}

interface SimpleSidebarProps {
  userName: string;
  condominioId: string;
  userId?: string;
  perfil?: PerfilUsuario;
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
  const router = useRouter();
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

  const createHref = (path: string) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (path === "/") {
      return `/${condominioId}?user=${userId}&perfil=${perfil}`;
    }
    return `/${condominioId}${cleanPath}?user=${userId}&perfil=${perfil}`;
  };

  let navItems: NavItem[] = [];

  if (perfil === PerfilUsuario.MORADOR) {
    navItems = [
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
        label: "Pré-cadastro",
        href: createHref("/cadastroEncomendas"),
        icon: PackagePlus,
        pathCheck: `/${condominioId}/cadastroEncomendas`,
      },
      {
        label: "Token de Acesso",
        href: createHref("/meuToken"),
        icon: ShieldAlert,
        pathCheck: `/${condominioId}/meuToken`,
      },
      {
        label: "Vincular Telegram",
        href: createHref("/telegramLink"),
        icon: IdCardLanyard,
        pathCheck: `/${condominioId}/telegramLink`,
      },
    ];
  } else if (perfil === PerfilUsuario.PORTEIRO) {
    navItems = [
      {
        label: "Painel da Portaria",
        href: createHref("/"),
        icon: Package,
        pathCheck: `/${condominioId}`,
      },
      {
        label: "Histórico",
        href: createHref("/historicoPorteiro"),
        icon: History,
        pathCheck: `/${condominioId}/historicoPorteiro`,
      },
      {
        label: "Token de Acesso",
        href: createHref("/meuToken"),
        icon: ShieldAlert,
        pathCheck: `/${condominioId}/meuToken`,
      },
      {
        label: "Vincular Telegram",
        href: createHref("/telegramLink"),
        icon: IdCardLanyard,
        pathCheck: `/${condominioId}/telegramLink`,
      },
    ];
  } else if (perfil === PerfilUsuario.SINDICO) {
    navItems = [
      {
        label: "Configurações",
        href: createHref("/"),
        icon: Settings,
        pathCheck: `/${condominioId}`,
      },
      {
        label: "Gerenciar Funcionários",
        href: createHref("/gerenciarFuncionarios"),
        icon: SquareChartGantt,
        pathCheck: `/${condominioId}/gerenciarFuncionarios`,
      },
      {
        label: "Token de Acesso",
        href: createHref("/meuToken"),
        icon: ShieldAlert,
        pathCheck: `/${condominioId}/meuToken`,
      },
      {
        label: "Gerenciar Links de Cadastro",
        href: createHref("/gerenciarLinksCadastro"),
        icon: ExternalLink,
        pathCheck: `/${condominioId}/gerenciarLinksCadastro`,
      },
      {
        label: "Gerenciar Moradores",
        href: createHref("/gerenciarMoradores"),
        icon: FolderKanban,
        pathCheck: `/${condominioId}/gerenciarMoradores`,
      },
      {
        label: "Vincular Telegram",
        href: createHref("/telegramLink"),
        icon: IdCardLanyard,
        pathCheck: `/${condominioId}/telegramLink`,
      },
    ];
  }

  const handleLogout = () => {
    router.replace("/");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col border-r bg-background h-screen transition-all duration-300 ease-in-out",
          !isMobile && "sticky top-0 z-50",
          isOpen ? "w-64" : "w-20",
          isMobile && "w-full border-none",
        )}
      >
        <div
          className={cn(
            "flex items-center h-14 border-b transition-all duration-300",
            isOpen ? "px-4" : "justify-center",
          )}
        >
          {!isMobile && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={cn("shrink-0 transition-all", !isOpen && "size-11")}
            >
              <Menu
                className={cn(
                  "transition-transform duration-300",
                  isOpen ? "size-5" : "size-5 rotate-180",
                )}
              />
            </Button>
          )}

          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              !isOpen && !isMobile
                ? "opacity-0 w-0 invisible ml-0"
                : "opacity-100 w-full visible ml-2",
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
                  className={cn(
                    "transition-all duration-300",
                    isOpen
                      ? "justify-start gap-3 px-4 h-11"
                      : "justify-center px-0 h-14 w-14 self-center",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon
                      className={cn(
                        "shrink-0 transition-all",
                        isOpen ? "size-4" : "size-5",
                      )}
                    />
                    <span
                      className={cn(
                        "transition-all duration-300",
                        !isOpen ? "opacity-0 w-0 hidden" : "opacity-100",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </Button>
              </TooltipTrigger>
              {!isOpen && (
                <TooltipContent side="right" className="font-semibold">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>

        <div
          className={cn(
            "px-2 pb-4 flex justify-center self-center",
            isOpen && "px-4 justify-start w-full",
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <ThemeToggle isOpen={isOpen} />
              </div>
            </TooltipTrigger>
            {!isOpen && (
              <TooltipContent side="right" className="font-semibold">
                Alternar Tema
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        <div
          className={cn(
            "p-3 border-t flex items-center justify-between overflow-hidden bg-muted/20",
            !isOpen && "justify-center flex-col space-y-6",
          )}
        >
          {isOpen ? (
            <div className="flex items-center min-w-0 pr-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0 border border-primary/20">
                <User className="size-4 text-primary" />
              </div>
              <span className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis text-sm block">
                {userName}
              </span>
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 cursor-help transition-transform hover:scale-105">
                  <User className="size-5 text-primary" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-bold">
                {userName}
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hover:bg-destructive hover:text-white shrink-0 transition-all group",
                  isOpen ? "size-9" : "size-11",
                )}
                onClick={handleLogout}
              >
                <LogOut
                  className={cn(
                    "shrink-0 transition-colors",
                    isOpen ? "size-4 mr-1" : "size-5",
                    "group-hover:text-white",
                  )}
                />
                <span className={cn(!isOpen && "sr-only")}>Sair</span>
              </Button>
            </TooltipTrigger>
            {!isOpen && <TooltipContent side="right">Sair</TooltipContent>}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}

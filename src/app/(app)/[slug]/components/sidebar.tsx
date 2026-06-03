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
  IdCardLanyard,
  UserPen,
  UserCog,
  Users,
  CreditCard,
  ArrowUpCircle,
  Wallet,
  FileText,
  Banknote,
  UserPlus,
  Home,
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

  if (perfil === PerfilUsuario.ADMINISTRADOR) {
    navItems = [
      {
        label: "Dashboard Admin",
        href: createHref("/"),
        icon: Settings,
        pathCheck: `/${condominioId}`,
      },
      {
        label: "Histórico Global",
        href: createHref("/historico"),
        icon: History,
        pathCheck: `/${condominioId}/historico`,
      },
      {
        label: "Histórico Portaria",
        href: createHref("/historicoPorteiro"),
        icon: History,
        pathCheck: `/${condominioId}/historicoPorteiro`,
      },
      {
        label: "Gerenciar Funcionários",
        href: createHref("/gerenciarFuncionarios"),
        icon: SquareChartGantt,
        pathCheck: `/${condominioId}/gerenciarFuncionarios`,
      },
      {
        label: "Gerenciar Links de Cadastro",
        href: createHref("/gerenciarLinksCadastro"),
        icon: ExternalLink,
        pathCheck: `/${condominioId}/gerenciarLinksCadastro`,
      },
      {
        label: "Gestão de Moradores",
        href: createHref("/gerenciarCadastroMoradores"),
        icon: Users,
        pathCheck: `/${condominioId}/gerenciarCadastroMoradores`,
      },
      {
        label: "Gerenciar Unidades",
        href: createHref("/gerenciarUnidades"),
        icon: Home,
        pathCheck: `/${condominioId}/gerenciarUnidades`,
      },
      {
        label: "Token de Acesso",
        href: createHref("/meuToken"),
        icon: ShieldAlert,
        pathCheck: `/${condominioId}/meuToken`,
      },
      {
        label: "Planos & Upgrade",
        href: createHref("/planos"),
        icon: CreditCard,
        pathCheck: `/${condominioId}/planos`,
      },
      {
        label: "Financeiro",
        href: createHref("/financeiro"),
        icon: Wallet,
        pathCheck: `/${condominioId}/financeiro`,
      },
      {
        label: "Cadastro de Síndico",
        href: createHref("/cadastroSindico"),
        icon: UserPlus,
        pathCheck: `/${condominioId}/cadastroSindico`,
      },
      {
        label: "Perfil",
        href: createHref("/meuPerfil"),
        icon: UserPen,
        pathCheck: `/${condominioId}/meuPerfil`,
      },
    ];
  } else if (perfil === PerfilUsuario.MORADOR) {
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
      {
        label: "Perfil",
        href: createHref("/meuPerfil"),
        icon: UserPen,
        pathCheck: `/${condominioId}/meuPerfil`,
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
      {
        label: "Perfil",
        href: createHref("/meuPerfil"),
        icon: UserPen,
        pathCheck: `/${condominioId}/meuPerfil`,
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
        label: "Gestão de Moradores",
        href: createHref("/gerenciarCadastroMoradores"),
        icon: Users,
        pathCheck: `/${condominioId}/gerenciarCadastroMoradores`,
      },
      {
        label: "Gerenciar Unidades",
        href: createHref("/gerenciarUnidades"),
        icon: Home,
        pathCheck: `/${condominioId}/gerenciarUnidades`,
      },
      {
        label: "Vincular Telegram",
        href: createHref("/telegramLink"),
        icon: IdCardLanyard,
        pathCheck: `/${condominioId}/telegramLink`,
      },
      {
        label: "Perfil",
        href: createHref("/meuPerfil"),
        icon: UserPen,
        pathCheck: `/${condominioId}/meuPerfil`,
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
            <p className="text-base font-bold text-foreground wrap-break-words line-clamp-2 leading-tight">
              {" "}
              {condominioName}
            </p>
          </div>
        </div>

        <nav className="flex flex-col space-y-1 p-2 flex-1 overflow-y-auto overflow-x-hidden">
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
            "p-3 border-t flex items-center justify-between overflow-hidden bg-muted/40 dark:bg-muted/20",
            !isOpen && "justify-center flex-col space-y-6",
          )}
        >
          {isOpen ? (
            <div className="flex items-center min-w-0 pr-2">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0 border border-primary/20">
                <User className="size-5 text-primary" />
              </div>
              <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis text-sm block text-foreground">
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
                size={isOpen ? "sm" : "icon"}
                className={cn(
                  "shrink-0 transition-all group flex items-center justify-center",
                  "hover:bg-destructive hover:text-destructive-foreground",
                  "dark:hover:bg-destructive dark:hover:text-white",
                  isOpen ? "px-3 h-9 gap-2 rounded-lg" : "size-11 rounded-full",
                )}
                onClick={handleLogout}
              >
                <LogOut
                  className={cn(
                    "shrink-0 transition-colors",
                    isOpen ? "size-4" : "size-5",
                  )}
                />
                {isOpen && (
                  <span className="text-xs font-extrabold uppercase tracking-tight">
                    Sair
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            {!isOpen && <TooltipContent side="right">Sair</TooltipContent>}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}

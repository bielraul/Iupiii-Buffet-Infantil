/**
 * Componente que protege rotas administrativas.
 * Verifica se o usuário está autenticado antes de renderizar o conteúdo.
 */
import { useEffect, useState, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService, UsuarioLogado } from "../../services/authService";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
}

export default function RotaProtegida({ children }: Props) {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const location = useLocation();

  useEffect(() => {
    async function verificar() {
      const user = await authService.verificarAuth();
      if (user) {
        setAutenticado(true);
        setUsuario(user);
      } else {
        setAutenticado(false);
      }
    }
    verificar();
  }, [location.pathname]); // Verifica a cada mudança de rota admin

  // Enquanto verifica, exibe loading
  if (autenticado === null) {
    return (
      <div className="min-h-screen bg-brand-beige/20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-dark/40">Verificando acesso...</p>
      </div>
    );
  }

  // Se não autenticado, redireciona para login
  if (!autenticado) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Se logado, renderiza o componente filho
  return <>{children}</>;
}

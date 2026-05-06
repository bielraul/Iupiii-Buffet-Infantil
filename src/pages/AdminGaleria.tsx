/**
 * Página administrativa para gerenciamento da galeria de fotos.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GaleriaItem } from "../types/galeria";
import { galeriaService } from "../services/galeriaService";
import { authService } from "../services/authService";
import FormularioGaleria from "../components/galeria/FormularioGaleria";
import ListaGaleriaAdmin from "../components/galeria/ListaGaleriaAdmin";
import { ChevronLeft, LayoutGrid, Loader2, Sparkles, LogOut } from "lucide-react";
import { motion } from "motion/react";

export default function AdminGaleria() {
  const [itens, setItens] = useState<GaleriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const carregarDados = async () => {
    setLoading(true);
    try {
      const dados = await galeriaService.listarFotosGaleria();
      setItens(dados);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Deseja realmente sair?")) {
      await authService.logout();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Admin */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/admin" 
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-primary hover:gap-3 transition-all"
              >
                <ChevronLeft size={16} /> Voltar ao Painel
              </Link>
              <span className="text-brand-dark/20 text-xs">|</span>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-all"
              >
                <LogOut size={14} /> Sair
              </button>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-bold text-brand-primary tracking-tight">Painel da Galeria</h1>
              <p className="text-brand-dark/40 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <Sparkles size={16} /> Gerencie as memórias do Iupiii Buffet
              </p>
            </div>
          </div>
          
          <div className="bg-brand-primary text-white px-8 py-4 rounded-3xl shadow-xl flex items-center gap-4">
            <LayoutGrid size={24} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total de Fotos</p>
              <p className="text-2xl font-bold leading-none">{itens.length}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Coluna do Formulário */}
          <aside className="lg:col-span-4 sticky top-12">
            <FormularioGaleria onSuccess={carregarDados} />
          </aside>

          {/* Coluna da Listagem */}
          <main className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-brand-dark">Fotos Cadastradas</h2>
              {loading && <Loader2 className="animate-spin text-brand-primary" size={24} />}
            </div>

            {loading && itens.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white rounded-[3rem] shadow-sm">
                <Loader2 className="animate-spin text-brand-primary" size={48} />
                <p className="text-sm font-bold uppercase tracking-widest text-brand-dark/40">Sincronizando fotos...</p>
              </div>
            ) : (
              <ListaGaleriaAdmin itens={itens} onRefresh={carregarDados} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

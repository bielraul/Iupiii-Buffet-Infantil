/**
 * Página do Painel Administrativo para gerenciamento de Depoimentos.
 */
import { useState, useEffect } from "react";
import { DepoimentoItem } from "../types/depoimentos";
import { depoimentosService } from "../services/depoimentosService";
import FormularioDepoimento from "../components/depoimentos/FormularioDepoimento";
import ListaDepoimentosAdmin from "../components/depoimentos/ListaDepoimentosAdmin";
import { MessageSquare, ArrowLeft, Loader2, Plus, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function AdminDepoimentos() {
  const [itens, setItens] = useState<DepoimentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const carregarDepoimentos = async () => {
    try {
      setLoading(true);
      const dados = await depoimentosService.listarDepoimentos();
      setItens(dados);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDepoimentos();
  }, []);

  return (
    <div className="min-h-screen bg-brand-beige/20 pb-20 font-sans">
      {/* Header Admin */}
      <nav className="bg-white border-b border-brand-primary/10 px-8 py-6 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-brand-dark flex items-center gap-3">
                <MessageSquare className="text-brand-primary" /> Depoimentos
              </h1>
              <p className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest mt-1">Painel de Controle Iupiii</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/galeria" 
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-brand-dark/60 hover:bg-brand-surface transition-all text-sm"
            >
              <LayoutDashboard size={18} /> Galeria
            </Link>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {showForm ? <ArrowLeft size={20} /> : <Plus size={20} />}
              {showForm ? "Voltar para Lista" : "Novo Depoimento"}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-8 mt-12 space-y-12">
        {showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FormularioDepoimento 
              onSuccess={() => {
                setShowForm(false);
                carregarDepoimentos();
              }} 
            />
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black text-brand-dark">Registros</h2>
                <p className="text-brand-dark/40 font-bold uppercase tracking-widest text-xs mt-1">Depoimentos reais dos pais iupiii</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-brand-primary">{itens.length}</span>
                <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">Total cadastrado</p>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-brand-primary" size={48} />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-dark/40">Sincronizando depoimentos...</p>
              </div>
            ) : (
              <ListaDepoimentosAdmin itens={itens} onRefresh={carregarDepoimentos} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

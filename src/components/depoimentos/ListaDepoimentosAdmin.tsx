/**
 * Componente que lista os depoimentos no painel administrativo.
 */
import { useState } from "react";
import { DepoimentoItem } from "../../types/depoimentos";
import { depoimentosService } from "../../services/depoimentosService";
import { Trash2, Save, Loader2, Star, User, Calendar, AlignLeft, Edit2 } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  itens: DepoimentoItem[];
  onRefresh: () => void;
}

export default function ListaDepoimentosAdmin({ itens, onRefresh }: Props) {
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [editValues, setEditValues] = useState<Record<string | number, Partial<DepoimentoItem>>>({});

  const handleFieldChange = (id: string | number, field: keyof DepoimentoItem, value: any) => {
    setEditValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleUpdate = async (item: DepoimentoItem) => {
    if (!item.id || !editValues[item.id]) return;
    
    setLoadingId(item.id);
    try {
      await depoimentosService.atualizarDepoimento(item.id, editValues[item.id]);
      setEditValues(prev => {
        const next = { ...prev };
        delete next[item.id!];
        return next;
      });
      onRefresh();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Erro ao atualizar depoimento.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Deseja realmente excluir este depoimento?")) return;
    
    setLoadingId(id);
    try {
      await depoimentosService.excluirDepoimento(id);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Erro ao excluir depoimento.");
    } finally {
      setLoadingId(null);
    }
  };

  if (itens.length === 0) {
    return (
      <div className="text-center py-20 bg-brand-surface/30 rounded-[3rem] border border-brand-primary/10">
        <p className="text-brand-dark/40 font-bold uppercase tracking-widest">Nenhum depoimento cadastrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {itens.map((item, i) => {
        const isEditing = !!editValues[item.id!];
        const currentData = { ...item, ...editValues[item.id!] };
        const isLoading = loadingId === item.id;

        return (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[2rem] p-6 shadow-lg border border-brand-primary/5 flex flex-col md:flex-row gap-6 items-start group relative"
          >
            {/* Foto / Avatar */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-brand-beige/40 flex-shrink-0 border-2 border-brand-primary/10">
              {item.url_foto ? (
                <img src={item.url_foto} className="w-full h-full object-cover" alt={item.nome} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-dark/20">
                  <User size={32} />
                </div>
              )}
            </div>

            {/* Conteúdo Editável */}
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Nome</label>
                  <input 
                    type="text" 
                    value={currentData.nome}
                    onChange={(e) => handleFieldChange(item.id!, "nome", e.target.value)}
                    className="w-full bg-brand-beige/20 border-none rounded-xl p-3 font-bold text-brand-dark text-sm focus:ring-1 focus:ring-brand-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Nota (1-5)</label>
                  <input 
                    type="number" 
                    min="1" max="5"
                    value={currentData.nota}
                    onChange={(e) => handleFieldChange(item.id!, "nota", parseInt(e.target.value))}
                    className="w-full bg-brand-beige/20 border-none rounded-xl p-3 font-bold text-brand-dark text-sm focus:ring-1 focus:ring-brand-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Depoimento</label>
                <textarea 
                  rows={2}
                  value={currentData.texto}
                  onChange={(e) => handleFieldChange(item.id!, "texto", e.target.value)}
                  className="w-full bg-brand-beige/20 border-none rounded-xl p-3 font-bold text-brand-dark text-sm focus:ring-1 focus:ring-brand-primary/20 resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Ordem</label>
                  <input 
                    type="number" 
                    value={currentData.ordem}
                    onChange={(e) => handleFieldChange(item.id!, "ordem", parseInt(e.target.value))}
                    className="w-32 bg-brand-beige/20 border-none rounded-xl p-3 font-bold text-brand-dark text-sm focus:ring-1 focus:ring-brand-primary/20"
                  />
                </div>
                {item.data_criacao && (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-brand-dark/30 mt-4">
                    <Calendar size={12} />
                    {new Date(item.data_criacao).toLocaleDateString("pt-BR")}
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
              <button 
                onClick={() => handleUpdate(item)}
                disabled={!isEditing || isLoading}
                className={`flex-1 md:w-12 md:h-12 flex items-center justify-center rounded-xl transition-all ${isEditing ? 'bg-brand-primary text-white shadow-lg' : 'bg-brand-surface text-brand-dark/20 cursor-not-allowed'}`}
                title="Salvar alterações"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              </button>
              <button 
                onClick={() => handleDelete(item.id!)}
                disabled={isLoading}
                className="flex-1 md:w-12 md:h-12 border-2 border-red-50 text-red-300 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-400 transition-all disabled:opacity-50"
                title="Excluir depoimento"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

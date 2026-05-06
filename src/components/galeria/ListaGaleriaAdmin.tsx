/**
 * Componente que lista os itens da galeria no painel administrativo.
 * Permite edição rápida de campos e exclusão.
 */
import { useState } from "react";
import { GaleriaItem, UnidadeGaleria } from "../../types/galeria";
import { galeriaService } from "../../services/galeriaService";
import { Trash2, Save, Loader2, Calendar, MapPin, AlignLeft } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  itens: GaleriaItem[];
  onRefresh: () => void;
}

export default function ListaGaleriaAdmin({ itens, onRefresh }: Props) {
  const [loadingId, setLoadingId] = useState<string | number | null>(null);
  const [editValues, setEditValues] = useState<Record<string | number, Partial<GaleriaItem>>>({});

  const handleFieldChange = (id: string | number, field: keyof GaleriaItem, value: any) => {
    setEditValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleUpdate = async (item: GaleriaItem) => {
    if (!item.id || !editValues[item.id]) return;
    
    setLoadingId(item.id);
    try {
      await galeriaService.atualizarFotoGaleria(item.id, editValues[item.id]);
      
      // Limpar os valores editados localmente após sucesso
      setEditValues(prev => {
        const next = { ...prev };
        delete next[item.id!];
        return next;
      });
      
      onRefresh();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Erro ao atualizar!");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (item: GaleriaItem) => {
    if (!item.id) return;
    if (!window.confirm("Deseja realmente excluir esta foto permanentemente?")) return;
    
    setLoadingId(item.id);
    try {
      await galeriaService.excluirFotoGaleria(item);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Erro ao excluir!");
    } finally {
      setLoadingId(null);
    }
  };

  if (itens.length === 0) {
    return (
      <div className="text-center py-20 bg-brand-surface/30 rounded-[3rem] border border-brand-primary/10">
        <p className="text-brand-dark/40 font-bold uppercase tracking-widest">Nenhuma foto cadastrada ainda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {itens.map((item, i) => {
        const isEditing = !!editValues[item.id!];
        const currentData = { ...item, ...editValues[item.id!] };
        const isLoading = loadingId === item.id;

        return (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-brand-primary/5 flex flex-col group"
          >
            <div className="relative h-56 overflow-hidden">
              <img src={item.url} className="w-full h-full object-cover" alt={item.legenda} />
              <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                # {item.ordem}
              </div>
              {isLoading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="animate-spin text-brand-primary" size={32} />
                </div>
              )}
            </div>

            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                {/* Legenda */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">
                    <AlignLeft size={12} /> Legenda
                  </div>
                  <input 
                    type="text" 
                    value={currentData.legenda}
                    onChange={(e) => handleFieldChange(item.id!, "legenda", e.target.value)}
                    className="w-full bg-brand-beige/20 border-none rounded-xl p-3 font-bold text-brand-dark text-sm focus:ring-1 focus:ring-brand-primary/20"
                  />
                </div>

                {/* Unidade */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">
                    <MapPin size={12} /> Unidade
                  </div>
                  <select 
                    value={currentData.unidade}
                    onChange={(e) => handleFieldChange(item.id!, "unidade", e.target.value as UnidadeGaleria)}
                    className="w-full bg-brand-beige/20 border-none rounded-xl p-3 font-bold text-brand-dark text-sm focus:ring-1 focus:ring-brand-primary/20 appearance-none"
                  >
                    <option value="sao-miguel">São Miguel</option>
                    <option value="vila-americana">Vila Americana</option>
                  </select>
                </div>

                {/* Ordem */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">
                    <AlignLeft size={12} className="rotate-90" /> Ordem
                  </div>
                  <input 
                    type="number" 
                    value={currentData.ordem}
                    onChange={(e) => handleFieldChange(item.id!, "ordem", e.target.value)}
                    className="w-full bg-brand-beige/20 border-none rounded-xl p-3 font-bold text-brand-dark text-sm focus:ring-1 focus:ring-brand-primary/20"
                  />
                </div>

                {item.data_criacao && (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-brand-dark/30 pt-2">
                    <Calendar size={12} />
                    Cadastrado em: {new Date(item.data_criacao).toLocaleDateString("pt-BR")}
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => handleUpdate(item)}
                  disabled={!isEditing || isLoading}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${isEditing ? 'bg-brand-primary text-white shadow-lg' : 'bg-brand-surface text-brand-dark/20 cursor-not-allowed'}`}
                >
                  <Save size={18} />
                  Salvar
                </button>
                <button 
                  onClick={() => handleDelete(item)}
                  disabled={isLoading}
                  className="w-14 h-14 border-2 border-red-100 text-red-400 rounded-2xl flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

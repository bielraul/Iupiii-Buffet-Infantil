/**
 * Componente público de depoimentos.
 * Busca dados reais do banco MySQL e mantém a estética do site.
 */
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { DepoimentoItem } from "../../types/depoimentos";
import { depoimentosService } from "../../services/depoimentosService";
import { Star, Quote, Loader2, User } from "lucide-react";

export default function DepoimentosPublicos() {
  const [itens, setItens] = useState<DepoimentoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await depoimentosService.listarDepoimentos();
        setItens(dados);
      } catch (err) {
        console.error("Erro ao carregar depoimentos:", err);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-dark/40">Carregando experiências...</p>
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <div className="text-center py-20 bg-brand-surface/30 rounded-[3rem] border border-brand-primary/5">
        <p className="text-brand-dark/40 font-bold uppercase tracking-widest text-sm">Nenhum depoimento cadastrado ainda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      {itens.map((t, i) => (
        <motion.div 
          key={t.id || i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-12 rounded-[3.5rem] shadow-[0_25px_60px_-15px_rgba(160,120,80,0.1)] space-y-8 relative group hover:scale-[1.02] transition-all border border-brand-primary/5"
        >
          <div className="flex gap-1 text-amber-400">
            {Array(5).fill(0).map((_, idx) => (
              <Star 
                key={idx} 
                size={20} 
                fill={idx < t.nota ? "currentColor" : "none"} 
                className={idx >= t.nota ? "text-brand-dark/5" : "drop-shadow-sm"}
              />
            ))}
          </div>
          
          <div className="relative">
            <p className="text-brand-dark/80 text-xl italic leading-relaxed font-medium relative z-10">
              "{t.texto}"
            </p>
            <Quote className="absolute -top-4 -left-6 text-brand-primary/10 -z-0" size={64} />
          </div>

          <div className="pt-8 border-t border-brand-primary/10 flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-beige rounded-3xl flex items-center justify-center font-bold text-brand-primary text-2xl overflow-hidden shadow-inner ring-4 ring-brand-primary/5">
              {t.url_foto ? (
                <img src={t.url_foto} className="w-full h-full object-cover" alt={t.nome} />
              ) : (
                <span className="font-display">{t.nome[0]}</span>
              )}
            </div>
            <div>
              <p className="font-bold text-brand-dark text-xl">{t.nome}</p>
              <p className="text-[10px] font-black text-brand-primary/50 uppercase tracking-[0.3em] mt-1">Cliente Iupiii</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

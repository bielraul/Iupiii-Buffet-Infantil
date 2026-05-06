/**
 * Componente público da galeria.
 * Busca dados reais do banco MySQL, separa por unidade e mantém a estética do site.
 */
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GaleriaItem, UnidadeGaleria } from "../../types/galeria";
import { galeriaService } from "../../services/galeriaService";
import { Loader2, Instagram, AlertCircle, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function GaleriaPublica() {
  const [itens, setItens] = useState<GaleriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unidadeAtiva, setUnidadeAtiva] = useState<UnidadeGaleria>("sao-miguel");
  
  // Estados para o Lightbox
  const [fotoIndex, setFotoIndex] = useState<number | null>(null);

  useEffect(() => {
    async function carregar() {
      setError(null);
      try {
        const dados = await galeriaService.listarFotosGaleria();
        setItens(dados);
      } catch (err: any) {
        console.error("Erro ao carregar galeria:", err);
        setError("Não foi possível carregar as fotos no momento.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const itensFiltrados = itens.filter(item => item.unidade === unidadeAtiva);

  const abrirLightbox = (index: number) => {
    setFotoIndex(index);
    document.body.style.overflow = "hidden";
  };

  const fecharLightbox = useCallback(() => {
    setFotoIndex(null);
    document.body.style.overflow = "auto";
  }, []);

  const proximaFoto = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (fotoIndex === null) return;
    setFotoIndex((fotoIndex + 1) % itensFiltrados.length);
  }, [fotoIndex, itensFiltrados.length]);

  const fotoAnterior = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (fotoIndex === null) return;
    setFotoIndex((fotoIndex - 1 + itensFiltrados.length) % itensFiltrados.length);
  }, [fotoIndex, itensFiltrados.length]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fotoIndex === null) return;
      if (e.key === "Escape") fecharLightbox();
      if (e.key === "ArrowRight") proximaFoto();
      if (e.key === "ArrowLeft") fotoAnterior();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fotoIndex, fecharLightbox, proximaFoto, fotoAnterior]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-dark/40">Carregando momentos mágicos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-brand-surface/30 rounded-[3rem] border border-red-100">
        <AlertCircle className="text-red-400" size={48} />
        <p className="text-sm font-bold uppercase tracking-widest text-brand-dark/40">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-brand-primary font-bold hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {fotoIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={fecharLightbox}
            className="fixed inset-0 z-[200] bg-brand-dark/95 backdrop-blur-md flex items-center justify-center p-6 md:p-12"
          >
            <motion.button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={fecharLightbox}
            >
              <X size={40} />
            </motion.button>

            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/10"
              onClick={fotoAnterior}
            >
              <ChevronLeft size={32} />
            </button>

            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/10"
              onClick={proximaFoto}
            >
              <ChevronRight size={32} />
            </button>

            <motion.div 
              key={itensFiltrados[fotoIndex].id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full flex flex-col items-center gap-6"
            >
              <img 
                src={itensFiltrados[fotoIndex].url} 
                className="max-h-[70vh] w-auto h-auto rounded-3xl shadow-2xl border border-white/10"
                alt={itensFiltrados[fotoIndex].legenda}
                referrerPolicy="no-referrer"
              />
              <div className="text-center text-white space-y-2">
                <p className="text-2xl font-bold italic font-display">{itensFiltrados[fotoIndex].legenda}</p>
                <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[.4em] opacity-40">
                  <span>Unidade {unidadeAtiva === 'sao-miguel' ? 'São Miguel' : 'Vila Americana'}</span>
                  <span>•</span>
                  <span>{fotoIndex + 1} de {itensFiltrados.length}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Abas de Unidades */}
      <div className="text-center space-y-6">
        <div className="inline-flex p-2 bg-brand-surface rounded-full gap-2 shadow-sm border border-brand-primary/5">
          <button 
            onClick={() => setUnidadeAtiva('sao-miguel')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${unidadeAtiva === 'sao-miguel' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-dark/60 hover:text-brand-primary'}`}
          >
            Unidade São Miguel
          </button>
          <button 
            onClick={() => setUnidadeAtiva('vila-americana')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${unidadeAtiva === 'vila-americana' ? 'bg-brand-primary text-white shadow-lg' : 'text-brand-dark/60 hover:text-brand-primary'}`}
          >
            Unidade Vila Americana
          </button>
        </div>
      </div>

      {/* Grid de Fotos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {itensFiltrados.length > 0 ? (
            itensFiltrados.map((item, i) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative cursor-pointer overflow-hidden rounded-[3rem] h-96 shadow-xl hover:shadow-brand-primary/20 bg-brand-surface border border-brand-primary/5"
                onClick={() => abrirLightbox(i)}
              >
                <img 
                  src={item.url} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt={item.legenda} 
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Premium */}
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-50 group-hover:scale-100 transition-transform duration-500">
                    <Maximize2 size={24} />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent flex items-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <div className="text-white space-y-2">
                    <p className="font-bold text-xl leading-snug font-display italic tracking-wide">{item.legenda}</p>
                    <p className="text-[9px] opacity-60 uppercase tracking-[0.3em] font-black">Clique para ampliar</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-brand-surface/30 rounded-[3rem] border border-brand-primary/5">
              <p className="text-brand-dark/40 font-bold uppercase tracking-widest">Nenhuma foto postada aqui ainda</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center">
        <a 
          href="https://instagram.com/buffet_iupiii" 
          target="_blank"
          className="inline-flex items-center gap-4 px-10 py-5 bg-white rounded-full text-brand-primary font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 active:scale-95 transition-all group border border-brand-primary/5"
        >
          <Instagram size={20} className="group-hover:rotate-12 transition-transform" />
          Siga nosso dia a dia @buffet_iupiii
        </a>
      </div>
    </div>
  );
}

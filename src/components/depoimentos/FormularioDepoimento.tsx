/**
 * Componente de formulário para cadastro e edição de depoimentos.
 */
import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { User, MessageSquare, Star, Send, Loader2, Upload, X, CheckCircle2 } from "lucide-react";
import { depoimentosService } from "../../services/depoimentosService";

interface Props {
  onSuccess: () => void;
}

export default function FormularioDepoimento({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [nome, setNome] = useState("");
  const [texto, setTexto] = useState("");
  const [nota, setNota] = useState(5);
  const [ordem, setOrdem] = useState(0);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("A imagem é muito grande (limite 5MB).");
        return;
      }
      setArquivo(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const resetForm = () => {
    setNome("");
    setTexto("");
    setNota(5);
    setOrdem(0);
    setArquivo(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await depoimentosService.adicionarDepoimento({
        nome,
        texto,
        nota,
        ordem
      }, arquivo || undefined);
      
      resetForm();
      setSuccess(true);
      onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ocorreu um erro ao salvar o depoimento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-brand-primary/10 space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-xl font-bold text-brand-dark">Novo Depoimento</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lado Esquerdo: Dados */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1 flex items-center gap-2">
              <User size={12} /> Nome do Cliente
            </label>
            <input 
              type="text" 
              required
              placeholder="Ex: Maria Oliveira"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-brand-beige/30 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary/20 font-bold text-brand-dark text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1 flex items-center gap-2">
              <Star size={12} /> Nota (1 a 5 Estrelas)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setNota(val)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${nota >= val ? 'bg-brand-primary text-white scale-110 shadow-lg' : 'bg-brand-beige/40 text-brand-dark/20'}`}
                >
                  <Star size={18} fill={nota >= val ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1 flex items-center gap-2">
              <MessageSquare size={12} /> Texto do Depoimento
            </label>
            <textarea 
              required
              rows={4}
              placeholder="Conte como foi a experiência..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full bg-brand-beige/30 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary/20 font-bold text-brand-dark text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1 flex items-center gap-2">
              Ordem de Exibição
            </label>
            <input 
              type="number" 
              required
              min="0"
              value={ordem}
              onChange={(e) => setOrdem(parseInt(e.target.value))}
              className="w-full bg-brand-beige/30 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary/20 font-bold text-brand-dark text-sm"
            />
          </div>
        </div>

        {/* Lado Direito: Foto (Opcional) */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1 flex items-center gap-2">
            <Upload size={12} /> Foto do Cliente (Opcional)
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative aspect-square rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${preview ? 'border-brand-primary' : 'border-brand-primary/20 bg-brand-beige/20 hover:bg-brand-beige/40'}`}
          >
            {preview ? (
              <>
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setArquivo(null);
                    setPreview(null);
                  }}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm text-white"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div className="text-center space-y-4 p-8">
                <User size={48} className="mx-auto text-brand-primary/20" />
                <div>
                  <p className="font-bold text-brand-dark">Adicionar Foto</p>
                  <p className="text-[10px] text-brand-dark/40 uppercase tracking-widest mt-1">Opcional</p>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              hidden 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-2 animate-shake">
          <X size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-bold flex items-center gap-2">
          <CheckCircle2 size={18} />
          Depoimento salvo com sucesso!
        </div>
      )}

      <button 
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-brand-primary text-white rounded-full font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          <>
            <Send size={20} />
            Cadastrar Depoimento
          </>
        )}
      </button>
    </form>
  );
}

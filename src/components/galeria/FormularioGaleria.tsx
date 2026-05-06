/**
 * Componente de formulário para upload e cadastro de fotos na galeria.
 */
import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { Upload, X, Loader2, Send, CheckCircle2 } from "lucide-react";
import { galeriaService } from "../../services/galeriaService";
import { UnidadeGaleria } from "../../types/galeria";

interface Props {
  onSuccess: () => void;
}

export default function FormularioGaleria({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [legenda, setLegenda] = useState("");
  const [unidade, setUnidade] = useState<UnidadeGaleria>("sao-miguel");
  const [ordem, setOrdem] = useState(0);
  
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validação básica no cliente
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("A imagem é muito grande. O limite é 5MB.");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Formato inválido. Use JPG, PNG ou WEBP.");
        return;
      }

      setArquivo(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const resetForm = () => {
    setArquivo(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setLegenda("");
    setUnidade("sao-miguel");
    setOrdem(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!arquivo) {
      setError("Por favor, selecione uma imagem.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await galeriaService.adicionarFotoGaleria(arquivo, {
        legenda,
        unidade,
        ordem
      });
      resetForm();
      setSuccess(true);
      onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro ao enviar a foto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-brand-primary/10 space-y-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
          <Upload size={20} />
        </div>
        <h3 className="text-xl font-bold text-brand-dark">Nova Foto</h3>
      </div>

      {/* Upload Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${preview ? 'border-brand-primary' : 'border-brand-primary/20 bg-brand-beige/20 hover:bg-brand-beige/40'}`}
      >
        {preview ? (
          <>
            <img src={preview} className="w-full h-full object-cover" alt="Preview" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <p className="text-white font-bold flex items-center gap-2">
                <Upload size={20} /> Trocar Imagem
              </p>
            </div>
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
            <Upload size={48} className="mx-auto text-brand-primary/40" />
            <div>
              <p className="font-bold text-brand-dark">Clique para selecionar</p>
              <p className="text-xs text-brand-dark/40 uppercase tracking-widest mt-1">PNG, JPG ou JPEG</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Legenda</label>
          <input 
            type="text" 
            required
            placeholder="Ex: Festa da Peppa Pig..."
            value={legenda}
            onChange={(e) => setLegenda(e.target.value)}
            className="w-full bg-brand-beige/30 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary/20 font-bold text-brand-dark text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Unidade</label>
          <select 
            value={unidade}
            onChange={(e) => setUnidade(e.target.value as UnidadeGaleria)}
            className="w-full bg-brand-beige/30 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary/20 appearance-none font-bold text-brand-dark text-sm"
          >
            <option value="sao-miguel">São Miguel Paulista</option>
            <option value="vila-americana">Vila Americana</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Ordem (Posição)</label>
        <input 
          type="number" 
          required
          min="0"
          value={ordem}
          onChange={(e) => setOrdem(parseInt(e.target.value))}
          className="w-full bg-brand-beige/30 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary/20 font-bold text-brand-dark text-sm"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold animate-shake">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-bold flex items-center gap-2">
          <CheckCircle2 size={18} />
          Foto cadastrada com sucesso!
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
            Salvar Foto na Galeria
          </>
        )}
      </button>
    </form>
  );
}

/**
 * Página de Login Administrativo
 */
import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { LogIn, Mail, Lock, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      await authService.login(email, senha);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setErro(err?.message || "Erro ao realizar login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige/20 flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#A07850_0.5px,transparent_0.5px)] [background-size:32px_32px] opacity-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8 space-y-4">
          <button 
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-brand-dark/40 hover:text-brand-primary font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> Voltar ao Site
          </button>
          <h1 className="font-display text-4xl text-brand-primary">Iupiii Admin</h1>
          <p className="text-brand-dark/50 text-sm font-medium tracking-tight">Acesse o painel de gerenciamento</p>
        </div>

        <form 
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-brand-primary/5 border border-brand-primary/10 space-y-8"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1 flex items-center gap-2">
                <Mail size={12} /> E-mail
              </label>
              <input 
                type="email" 
                required
                placeholder="exemplo@iupiii.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-beige/30 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary/20 font-bold text-brand-dark text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 ml-1 flex items-center gap-2">
                <Lock size={12} /> Senha
              </label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-brand-beige/30 border-none rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary/20 font-bold text-brand-dark text-sm"
              />
            </div>
          </div>

          {erro && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {erro}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-brand-primary text-white rounded-full font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <LogIn size={20} />
                Entrar no Painel
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-bold text-brand-dark/30 uppercase tracking-[0.3em]">
          Ambiente restrito • Iupiii Buffet Infantil
        </p>
      </motion.div>
    </div>
  );
}

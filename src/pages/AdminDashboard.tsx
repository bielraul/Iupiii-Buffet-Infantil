/**
 * Dashboard Principal do Administrador
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService, UsuarioLogado } from "../services/authService";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  MessageSquare, 
  LogOut, 
  ArrowRight,
  Settings,
  Users
} from "lucide-react";
import { motion } from "motion/react";

export default function AdminDashboard() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregar() {
      const user = await authService.verificarAuth();
      setUsuario(user);
    }
    carregar();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Erro ao sair.");
    }
  };

  const menuItems = [
    {
      title: "Galeria de Fotos",
      desc: "Gerencie as fotos das unidades São Miguel e Vila Americana.",
      icon: ImageIcon,
      link: "/admin/galeria",
      color: "bg-amber-500"
    },
    {
      title: "Depoimentos",
      desc: "Administre o que os clientes dizem sobre o buffet.",
      icon: MessageSquare,
      link: "/admin/depoimentos",
      color: "bg-brand-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-beige/20 font-sans">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#A07850_0.5px,transparent_0.5px)] [background-size:48px_48px] opacity-10" />
      
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-brand-primary/10 px-8 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-brand-dark tracking-tight">Painel Admin</h1>
              <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-[0.2em] mt-0.5">Iupiii Buffet Infantil</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-brand-dark">{usuario?.nome || "Administrador"}</p>
              <p className="text-[10px] text-brand-dark/40 font-bold uppercase tracking-widest">{usuario?.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-brand-dark mb-2"
          >
            Bem-vindo de volta, <span className="text-brand-primary">{usuario?.nome?.split(' ')[0] || "Admin"}</span>!
          </motion.h2>
          <p className="text-brand-dark/40 font-medium text-lg">O que desejas gerenciar hoje em seu reino mágico?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                to={item.link}
                className="group block bg-white p-8 rounded-[3rem] shadow-xl shadow-brand-primary/5 border border-brand-primary/5 hover:scale-[1.03] transition-all relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`} />
                
                <div className="space-y-6 relative z-10">
                  <div className={`w-16 h-16 ${item.color} text-white rounded-3xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                    <item.icon size={32} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-brand-dark">{item.title}</h3>
                    <p className="text-sm text-brand-dark/50 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-brand-primary font-bold text-sm group-hover:gap-4 transition-all">
                    Acessar Módulo
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Cards de Atalho/Status (Exemplos) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-brand-primary p-8 rounded-[3rem] text-white space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Settings size={24} />
              </div>
              <h3 className="text-2xl font-bold">Configurações</h3>
              <p className="text-white/70 text-sm font-medium">
                Em breve você poderá gerenciar e-mails, endereços e redes sociais diretamente aqui.
              </p>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Em desenvolvimento</div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <div className="mt-24 pt-8 border-t border-brand-primary/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-brand-dark/30">
            <Users size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Acesso Registrado como {usuario?.nome}</span>
          </div>
          <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-[0.4em]">© 2026 Sistema Iupiii • V2.0</p>
        </div>
      </main>
    </div>
  );
}

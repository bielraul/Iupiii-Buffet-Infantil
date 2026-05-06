/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  Instagram, 
  ChevronRight, 
  CheckCircle2, 
  Palette, 
  Users2, 
  Star, 
  Menu, 
  X,
  Play,
  Quote,
  Timer,
  Calendar,
  PenTool,
  Smile,
  Send
} from 'lucide-react';
import GaleriaPublica from '../components/galeria/GaleriaPublica';
import DepoimentosPublicos from '../components/depoimentos/DepoimentosPublicos';

const IMAGES = {
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-cLRqQ8uG5GXhMkcTa9ObX799LHLwKWkRB5esW0qhDMHFbJHKCAitF5LDfrOhGsQnCX1-z_nn3wwOurKLZ8qsvuQYNu_BSIXrYIKgPdGQHKCjHpQVR3QGQBaHguFzi5hZEtTbHF-1scGy5r617aI-uHiUCQdIFBgCWQ2zI-i6clOh2vf1gnaWlF9tvrCuQxYYXkf8ZoTorOfER_SzJi2STbPL2S6uV7ZwcSsvvDJV8wmwCDVcIIlixYu1DGe_o03-E6-dYr8ATo3p",
  aboutImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuC12a_t6osc-G8KSaOAZJItP385e-ZRqaCz3piZ5TtNd_U15UvCYkyPFij2pgLzgXBDR0g3zZBHzvfuuyYWSyiFoKoFPX50to5uHEXmbV8rUYsWHT7o31ZWr-dV6tp3ZG8m1qjLgcQGAW12sY7KxheL6xJuOlZjyYXXqNRBTg_BLOzQ3CWf-HMzxxj8_GKpBv2g2rCVrjndSuZAg13vJx7OHoCTwmvZBTMrlLg6vrJ5erLj67spxrs26hBRYQP7a0e95AmLqEJ6BUKb",
  unit1: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyqA9sR8jMemaykC-wiwIIuvkooTvZ4Lnm_jAdqnZYiLHMSLJeQw0RK57wY3UI7p0pg60iU_3MGhE36h716poiuzxfTyN4zwwtEO-sBsiG5Z_yPTA0kdgNl93soZoGXfdhEXWF6EpTuSwgkOlyuTRZJqj6CgOFVDUg8RFfuKPyyojwRos9urnUU_sp_WroTfODkwaOVMS6s-oCpeaTDMI7UpZWVmoyI62wzNpeTs6G-eH94lJ_sN4WeJ3BOQ8BdzWjxp4JwEsDR0Fd",
  unit2: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXYRyI5KRXaLdKiQ-Gf4o1svbLAitLd-GmZprp9SBB9bc4F2Wf0RW3am8alHlaRNSFAjTK-2Bf7EXAnBQI5pChjFdm6mOcgS6cWvgyzSrCryQ7YvDQzuHtOItdQ6N2Wj7Fqj3UlyDbw3SaBlJdlDXku8wxOH4m4yb2AUl2_rVueVNeqNPLPCEgKk1uUJDYqgPwUvfukvEUM9kIvZBGZx-843LvaqiGr_DMq5AHl0i_Zav9MeAY0HreivU4hZNTJ_y8d2vks2DbACWN",
};

const STATS = [
  { label: "Festas Realizadas", value: "+500" },
  { label: "Seguidores", value: "47k" },
  { label: "Unidades em SP", value: "2" },
  { label: "Anos de Experiência", value: "+5" },
];

const DIFFERENTIALS = [
  { icon: CheckCircle2, title: "100% Seguro", desc: "Monitoramento constante e infraestrutura certificada." },
  { icon: Palette, title: "Decorações Únicas", desc: "Projetos artísticos exclusivos para cada tema." },
  { icon: Users2, title: "Equipe Especializada", desc: "Profissionais treinados no acolhimento familiar." },
  { icon: Star, title: "Eventos Premium", desc: "Qualidade garantida em todos os detalhes." },
];

const STEPS = [
  { icon: Send, title: "1. Contato", desc: "Envie uma mensagem solicitando orçamento." },
  { icon: Calendar, title: "2. Agende Visita", desc: "Venha conhecer nossas unidades pessoalmente." },
  { icon: PenTool, title: "3. Escolha o Tema", desc: "Personalize cada detalhe da sua celebração." },
  { icon: Smile, title: "4. Relaxe", desc: "Nós cuidamos de tudo para você aproveitar." },
];

const TESTIMONIALS = [
  {
    name: "Mariana Silva",
    tag: "Mãe do Arthur - 1 Ano",
    text: "Simplesmente perfeito! A festa do Arthur superou todas as expectativas. A decoração era impecável e a equipe muito atenciosa.",
    stars: 5
  },
  {
    name: "Ricardo Santos",
    tag: "Pai da Beatriz - 5 Anos",
    text: "O melhor buffet de São Paulo. Já é o terceiro ano que fazemos aqui e cada vez eles se superam.",
    stars: 5
  },
  {
    name: "Carla Oliveira",
    tag: "Mãe do Theo - 2 Anos",
    text: "Equipe nota mil! Atendimento sensacional desde a recepção até os monitores com as crianças.",
    stars: 5
  },
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'miguel' | 'vila'>('miguel');
  const [guestCount, setGuestCount] = useState(50);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsApp = (e?: FormEvent) => {
    e?.preventDefault();
    const text = encodeURIComponent("Olá! Gostaria de solicitar um orçamento para uma festa no Iupiii Buffet Infantil.");
    window.open(`https://wa.me/5511947434360?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-beige/90 backdrop-blur-xl border-b border-brand-primary/10 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="font-display text-3xl text-brand-primary">Iupiii Buffet Infantil</a>
          
          <div className="hidden md:flex items-center gap-8">
            {['Sobre', 'Fotos', 'Unidades', 'Orçamento'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sm uppercase font-bold text-brand-dark/70 hover:text-brand-primary transition-colors tracking-widest"
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => handleWhatsApp()}
              className="bg-brand-primary text-white px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Solicitar Orçamento
            </button>
          </div>

          <button className="md:hidden text-brand-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-brand-surface border-b border-brand-primary/10 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4">
                {['Sobre', 'Fotos', 'Unidades', 'Orçamento'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold text-brand-primary"
                  >
                    {item}
                  </a>
                ))}
                <button 
                  onClick={() => handleWhatsApp()}
                  className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold"
                >
                  Solicitar Orçamento
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-48 pb-32 px-6 overflow-hidden min-h-[95vh] flex flex-col items-center justify-center">
        {/* Camada de Fundo Dinâmica */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(#A07850_0.8px,transparent_0.8px)] [background-size:32px_32px] opacity-[0.07]" />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-brand-primary/5 rounded-full blur-[120px]" 
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl text-center space-y-16 relative"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <img 
              src={IMAGES.logo} 
              alt="Logo Iupiii" 
              className="h-36 md:h-64 mx-auto object-contain drop-shadow-2xl"
            />
          </motion.div>
          
          <div className="space-y-8">
            <h1 className="font-display text-6xl md:text-9xl text-brand-primary leading-tight drop-shadow-sm">
              Mais do que Festas.<br />
              <span className="text-brand-dark/90 italic">Realizamos Sonhos!</span>
            </h1>
            <p className="text-xl md:text-2xl text-brand-dark/60 max-w-2xl mx-auto font-medium leading-relaxed">
              Um refúgio mágico em São Paulo onde cada detalhe é desenhado para criar memórias eternas para sua família.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <motion.button 
              whileHover={{ scale: 1.05, translateY: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWhatsApp()}
              className="inline-flex items-center gap-4 bg-brand-primary text-white px-12 py-6 rounded-full font-bold text-xl shadow-[0_20px_50px_rgba(160,120,80,0.3)] hover:shadow-brand-primary/40 transition-all group"
            >
              <Phone size={24} className="group-hover:rotate-12 transition-transform" />
              Solicitar Orçamento
            </motion.button>
            <a 
              href="#fotos"
              className="text-brand-dark/40 font-bold uppercase tracking-[0.3em] text-sm hover:text-brand-primary transition-colors flex items-center gap-2 group"
            >
              Conheça nossas unidades
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 text-brand-primary/30 hidden md:block"
        >
          <ChevronRight className="rotate-90" size={32} />
        </motion.div>
      </header>

      {/* Stats Bar */}
      <section className="bg-brand-primary/5 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {STATS.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-4xl md:text-5xl font-bold text-brand-primary mb-2 tracking-tighter">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-dark/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 border border-brand-primary/10 rounded-2xl transform rotate-3" />
            <img 
              src={IMAGES.aboutImage} 
              alt="Ambiente" 
              className="rounded-2xl shadow-2xl relative z-10 w-full aspect-[4/5] object-cover"
            />
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-2xl shadow-xl z-20 hidden lg:block">
              <p className="font-display text-4xl text-brand-primary leading-none mb-1">+ de 47k</p>
              <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest">Seguidores no Insta</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest">Nossa Essência</span>
              <h2 className="text-4xl md:text-6xl font-bold text-brand-primary leading-none tracking-tight">Referência em Excelência em SP</h2>
              <p className="text-brand-dark/70 text-lg leading-relaxed">
                Acreditamos que festas infantis devem ser experiências sensoriais completas. Oferecemos ambientes seguros, decorações temáticas exclusivas e uma gastronomia que encanta paladares de todas as idades.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {DIFFERENTIALS.map((item) => (
                <div key={item.title} className="flex flex-col gap-4">
                  <div className="w-14 h-14 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark text-xl">{item.title}</h4>
                    <p className="text-sm text-brand-dark/50 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-brand-surface/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-display text-6xl text-brand-primary">Como Funciona</h2>
            <div className="h-1 w-20 bg-brand-primary/20 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {STEPS.map((step, i) => (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-6 group"
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:bg-brand-primary group-hover:text-white transition-all border-4 border-white">
                  <step.icon size={40} className="transition-colors" />
                </div>
                <div className="space-y-2 px-4">
                  <h3 className="font-bold text-xl text-brand-dark tracking-tight">{step.title}</h3>
                  <p className="text-sm text-brand-dark/60 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button 
              onClick={() => handleWhatsApp()}
              className="px-12 py-5 bg-white text-brand-primary border-2 border-brand-primary rounded-full font-bold text-xl shadow-lg hover:bg-brand-primary hover:text-white transition-all transform hover:-translate-y-1"
            >
              Agendar minha visita agora
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="fotos" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-brand-primary tracking-tight">Nossa Galeria de Sonhos</h2>
            <p className="text-brand-dark/40 font-bold uppercase tracking-widest text-sm">Momentos reais em nossas unidades</p>
          </div>

          {/* Galeria Dinâmica Conectada ao Firebase */}
          <GaleriaPublica />
        </div>
      </section>

      {/* Video Section */}
      <section className="py-32 bg-brand-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-display text-7xl md:text-9xl text-white drop-shadow-lg">Veja a magia acontecer</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-medium">
              Cada sorriso, cada abraço e cada detalhe capturado para você sentir a verdadeira energia de nossas festas.
            </p>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="relative group cursor-pointer aspect-video rounded-[3rem] overflow-hidden shadow-[0_50px_120px_-20px_rgba(0,0,0,0.6)] border-[1px] border-white/20 mx-auto max-w-4xl"
          >
            <img src={IMAGES.aboutImage} className="w-full h-full object-cover brightness-[0.4] group-hover:brightness-50 group-hover:scale-105 transition-all duration-1000" alt="Vídeo Teaser" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                whileHover={{ scale: 1.15 }}
                className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl text-brand-primary relative"
              >
                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20" />
                <Play size={48} fill="currentColor" className="ml-2" />
              </motion.div>
            </div>
            
            {/* Overlay Gradient Inferior */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-brand-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <Quote size={80} className="text-brand-primary/10 mx-auto mb-4" />
            <h2 className="text-5xl md:text-7xl font-bold text-brand-primary tracking-tight">Vozes de Alegria</h2>
            <p className="text-brand-dark/40 font-bold uppercase tracking-[0.4em] text-xs">O que os pais dizem sobre o Iupiii</p>
          </div>

          <DepoimentosPublicos />
        </div>
      </section>

      {/* Budget Simulator */}
      <section id="orçamento" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <h2 className="font-display text-6xl text-brand-primary">Simule seu Evento</h2>
            <p className="text-brand-dark/50 text-lg">Receba um orçamento guia em menos de 2 minutos.</p>
          </div>

          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-16 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(160,120,80,0.15)] space-y-12 border border-brand-primary/5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 block">Tipo de Evento</label>
                <select className="w-full bg-brand-beige/30 border-none rounded-2xl p-5 focus:ring-2 focus:ring-brand-primary/20 appearance-none font-bold text-brand-dark">
                  <option>Aniversário Infantil</option>
                  <option>Festa Escolar</option>
                  <option>Evento Corporativo</option>
                  <option>Batizado / Comunhão</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 block">Data Prevista</label>
                <input type="date" className="w-full bg-brand-beige/30 border-none rounded-2xl p-5 focus:ring-2 focus:ring-brand-primary/20 font-bold text-brand-dark" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-brand-dark/40">Número de Convidados</label>
                <span className="bg-brand-primary text-white px-6 py-2 rounded-full font-bold text-xl shadow-lg ring-4 ring-brand-primary/10">
                  {guestCount}{guestCount >= 200 ? '+' : ''}
                </span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="200" 
                step="10" 
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="w-full h-3 bg-brand-beige rounded-full appearance-none cursor-pointer accent-brand-primary"
              />
              <div className="flex justify-between text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest px-1">
                <span>30 Convidados</span>
                <span>200+ Convidados</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 block mb-6">Local de Preferência</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['São Miguel Paulista', 'Vila Americana'].map((unit) => (
                  <label key={unit} className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${activeTab === (unit.includes('Miguel') ? 'miguel' : 'vila') ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-brand-beige bg-transparent text-brand-dark/40'}`}>
                    <input 
                      type="radio" 
                      name="unit" 
                      checked={activeTab === (unit.includes('Miguel') ? 'miguel' : 'vila')}
                      onChange={() => setActiveTab(unit.includes('Miguel') ? 'miguel' : 'vila')}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${activeTab === (unit.includes('Miguel') ? 'miguel' : 'vila') ? 'border-brand-primary' : 'border-brand-beige'}`}>
                      {activeTab === (unit.includes('Miguel') ? 'miguel' : 'vila') && <div className="w-2.5 h-2.5 bg-brand-primary rounded-full" />}
                    </div>
                    <span className="font-bold">{unit}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={(e) => handleWhatsApp(e as any)}
              className="w-full py-6 bg-brand-primary text-white rounded-full font-bold text-xl shadow-[0_20px_40px_rgba(160,120,80,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
            >
              <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              Solicitar Orçamento no WhatsApp
            </button>
          </motion.form>
        </div>
      </section>

      {/* Units Section */}
      <section id="unidades" className="py-24 px-6 bg-brand-surface/30">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-brand-primary tracking-tight">Nossas Unidades</h2>
            <p className="text-brand-dark/40 font-bold uppercase tracking-widest text-sm">Estrutura completa em localizações estratégicas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { name: 'São Miguel Paulista', address: 'Rua Paschoal Daniel, 80', img: IMAGES.unit1 },
              { name: 'Vila Americana', address: 'Av. Pires do Rio, 339', img: IMAGES.unit2 }
            ].map((unit) => (
              <motion.div 
                key={unit.name}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col h-full"
              >
                <div className="h-72 overflow-hidden relative">
                  <div className="absolute top-6 left-6 z-20 bg-brand-primary text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Unidade Premium</div>
                  <img src={unit.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="p-10 space-y-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-brand-primary">{unit.name}</h3>
                    <div className="flex items-start gap-3 text-brand-dark/50">
                      <MapPin className="shrink-0 mt-1" size={20} />
                      <p className="text-lg leading-tight font-medium">{unit.address}</p>
                    </div>
                  </div>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(unit.address)}`} 
                    target="_blank"
                    className="flex items-center justify-center gap-3 w-full py-5 border-2 border-brand-primary text-brand-primary rounded-2xl font-bold hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                  >
                    Abrir no Google Maps
                    <ChevronRight size={20} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-brand-beige pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-white/20 to-brand-primary" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-start">
          <div className="md:col-span-5 space-y-10">
            <div className="space-y-4">
              <h2 className="font-display text-5xl text-brand-primary underline decoration-white/10 underline-offset-8">Iupiii Buffet</h2>
              <p className="text-brand-beige/60 text-lg leading-relaxed max-w-sm">
                Especialistas em transformar a festa do seu filho no evento mais comentado do ano. Criatividade, segurança e carinho transformados em memórias.
              </p>
            </div>
            
            <div className="flex gap-4">
              {[Instagram, Send, Phone].map((Icon, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -5 }}
                  href="#"
                  className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-primary transition-colors border border-white/10"
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-primary">Explorar</h4>
            <ul className="space-y-5 text-brand-beige/50 font-bold">
              {['Sobre Nós', 'Galeria', 'Nossas Unidades', 'Simulador'].map(item => (
                <li key={item}><a href="#" className="hover:text-white transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" /> {item}</a></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-primary">Contato Direto</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary"><Phone size={20} /></div>
                <div>
                  <p className="text-xs text-brand-beige/40 font-bold uppercase tracking-widest">WhatsApp</p>
                  <p className="font-bold text-lg">(11) 94743-4360</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary"><Timer size={20} /></div>
                <div>
                  <p className="text-xs text-brand-beige/40 font-bold uppercase tracking-widest">Atendimento</p>
                  <p className="font-bold">Seg - Sáb, 10h às 19h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
          <p>© 2026 Iupiii Buffet Infantil</p>
          <p>Realizamos Sonhos em São Paulo</p>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-6 items-end pointer-events-none">
        {/* Instagram - Glass Style */}
        <motion.a 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: -5 }}
          href="https://instagram.com/buffet_iupiii"
          target="_blank"
          className="pointer-events-auto group flex items-center gap-4 bg-white/70 backdrop-blur-xl p-2 pr-6 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] border border-white/40 transition-all hover:bg-white"
        >
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Instagram size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-dark/30 leading-none">Acompanhe</span>
            <span className="text-xs font-black text-brand-dark leading-tight">Nosso Instagram</span>
          </div>
        </motion.a>
        
        {/* WhatsApp - Action Style */}
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-brand-dark text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl relative"
          >
            Fale agora e garanta sua data 🎉
            <div className="absolute top-full right-6 w-3 h-3 bg-brand-dark rotate-45 -translate-y-1.5" />
          </motion.div>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleWhatsApp()}
            className="bg-[#25D366] text-white p-5 rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.4)] flex items-center justify-center relative group"
          >
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20 group-hover:hidden" />
            <Send size={40} className="fill-current -rotate-45 pr-1 pb-1" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

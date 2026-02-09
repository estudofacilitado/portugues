import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  BookOpen,
  Star,
  ArrowRight,
  MoveRight,
  FileText,
  Flame,
  X,
  Search,
  Target,
  FileCheck,
  BadgeCheck,
  ShoppingBag,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Section } from './components/Section';
import { Testimonials } from './components/Testimonials';
import { Summary } from './components/Summary';

const App: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [spotsLeft, setSpotsLeft] = useState(7);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [isExitIntentOpen, setIsExitIntentOpen] = useState(false);
  const [canShowExitIntent, setCanShowExitIntent] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const [urgencyDates, setUrgencyDates] = useState('');

  // Estados para Prova Social
  const [currentNotification, setCurrentNotification] = useState<{ name: string, city: string, plan: string, time: string } | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [hasReachedPricing, setHasReachedPricing] = useState(false);

  // Lógica de Data Dinâmica para o Gatilho de Urgência
  useEffect(() => {
    const getFormattedUrgencyDates = () => {
      const now = new Date();
      const d0 = new Date(now);
      const d1 = new Date(now); d1.setDate(now.getDate() - 1);
      const d2 = new Date(now); d2.setDate(now.getDate() - 2);

      const dates = [d2, d1, d0];
      const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

      // Se todos os dias forem do mesmo mês
      if (dates[0].getMonth() === dates[2].getMonth()) {
        return `${dates[0].getDate()}, ${dates[1].getDate()} e ${dates[2].getDate()} de ${monthNames[dates[2].getMonth()]}`;
      } else {
        // Transição de meses
        const parts = dates.map((d, i) => {
          const next = dates[i + 1];
          // Se o próximo dia for de um mês diferente, inclui o nome do mês atual
          if (next && d.getMonth() !== next.getMonth()) {
            return `${d.getDate()} de ${monthNames[d.getMonth()]}`;
          }
          return `${d.getDate()}`;
        });
        return `${parts[0]}, ${parts[1]} e ${parts[2]} de ${monthNames[dates[2].getMonth()]}`;
      }
    };

    setUrgencyDates(getFormattedUrgencyDates());
  }, []);

  // Dados base para gerar notificações dinâmicas
  const peopleData = [
    { name: "Maria Oliveira", location: "Belo Horizonte, MG" },
    { name: "João Silva", location: "São Paulo, SP" },
    { name: "Ana Beatriz", location: "Salvador, BA" },
    { name: "Carlos Eduardo", location: "Rio de Janeiro, RJ" },
    { name: "Fernanda Lima", location: "Fortaleza, CE" },
    { name: "Ricardo Souza", location: "Cuiabá, MT" },
    { name: "Juliana Mendes", location: "Uberlândia, MG" },
    { name: "Marcos Vinícius", location: "Campinas, SP" },
    { name: "Patrícia Gomes", location: "Feira de Santana, BA" },
    { name: "Bruno Henrique", location: "Niterói, RJ" },
    { name: "Aline Santos", location: "Juazeiro do Norte, CE" },
    { name: "Gustavo Rocha", location: "Rondonópolis, MT" },
    { name: "Camila Farias", location: "Contagem, MG" },
    { name: "Rodrigo Alves", location: "Ribeirão Preto, SP" },
    { name: "Letícia Costa", location: "Vitória da Conquista, BA" },
    { name: "Thiago Nobre", location: "Duque de Caxias, RJ" },
    { name: "Daniela Vaz", location: "Sobral, CE" },
    { name: "Felipe Melo", location: "Sinop, MT" },
    { name: "Renata Borges", location: "Juiz de Fora, MG" },
    { name: "Sérgio Ramos", location: "Santos, SP" },
    { name: "Tatiana Luz", location: "Porto Seguro, BA" },
    { name: "Paulo Victor", location: "Petrópolis, RJ" },
    { name: "Larissa Paiva", location: "Caucaia, CE" },
    { name: "Igor Guimarães", location: "Várzea Grande, MT" }
  ];

  const timeVariations = [
    "há 3 minutos", "há 7 minutos", "há 12 minutos", "há 18 minutos",
    "há 24 minutos", "há 37 minutos", "há 43 minutos", "há 52 minutos",
    "há 1 hora", "há 2 horas"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setCanShowExitIntent(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      const hasShown = sessionStorage.getItem('exitIntentShown');
      if (e.clientY <= 0 && canShowExitIntent && !hasShown) {
        setIsExitIntentOpen(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseOut);
    return () => document.removeEventListener('mouseleave', handleMouseOut);
  }, [canShowExitIntent]);

  // Monitorar Scroll para CTA Mobile e Prova Social
  useEffect(() => {
    const handleScroll = () => {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        const rect = pricingSection.getBoundingClientRect();
        setShowMobileCta(rect.top <= window.innerHeight * 0.8);

        if (rect.top <= window.innerHeight && !hasReachedPricing) {
          setHasReachedPricing(true);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasReachedPricing]);

  // Ciclo da Prova Social com Lógica de Probabilidade
  useEffect(() => {
    if (!hasReachedPricing) return;

    let notificationTimeout: number;
    let cycleInterval: number;

    const showNext = () => {
      const person = peopleData[Math.floor(Math.random() * peopleData.length)];
      const isVip = Math.random() < 0.9;
      const planName = isVip ? "Plano VIP" : "Plano Básico";
      const isNow = Math.random() < 0.4;
      const timeLabel = isNow ? "AGORA" : timeVariations[Math.floor(Math.random() * timeVariations.length)];

      setCurrentNotification({
        name: person.name,
        city: person.location,
        plan: planName,
        time: timeLabel
      });

      setShowNotification(true);

      notificationTimeout = window.setTimeout(() => {
        setShowNotification(false);
      }, 4000);
    };

    const initialDelay = window.setTimeout(showNext, 3000);

    cycleInterval = window.setInterval(() => {
      showNext();
    }, 15000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(notificationTimeout);
      clearInterval(cycleInterval);
    };
  }, [hasReachedPricing]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSpotsLeft(prev => prev > 2 ? prev - 1 : prev);
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  const scrollToPricing = () => {
    setIsExitIntentOpen(false);
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVip = () => {
    document.getElementById('vip-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleBasicPurchase = () => setIsUpsellOpen(true);

  const handleAcceptVIP = () => window.location.href = `https://payfast.greenn.com.br/131540/offer/FG2hDz?ch_id=134278&b_id_1=131541&b_offer_1=mnuFh6${window.location.search ? '&' + window.location.search.substring(1) : ''}`;
  const handleDeclineVIP = () => window.location.href = `https://payfast.greenn.com.br/131539/offer/5twBw0?ch_id=133970&b_id_1=131538&b_offer_1=9gZ3hu&b_id_2=131541&b_offer_2=mnuFh6${window.location.search ? '&' + window.location.search.substring(1) : ''}`;
  const handleAcceptUpgrade = () => window.location.href = `https://payfast.greenn.com.br/131540/offer/7g6I8P?ch_id=134278&b_id_1=131541&b_offer_1=mnuFh6${window.location.search ? '&' + window.location.search.substring(1) : ''}`;

  const bonuses = [
    {
      id: "01",
      title: "Resumo de Raciocínio Lógico",
      desc: "Estude o essencial: proposições, lógica formal, questões matemáticas e interpretação de situações-problema.",
      price: "R$55,00",
      image: "https://estudofacilitado.com.br/wp-content/uploads/2025/11/RL-Bonus.png"
    },
    {
      id: "02",
      title: "Resumo de Leis Cobradas",
      desc: "Os principais pontos das leis mais cobradas, explicados sem juridiquês e focado em memorização.",
      price: "R$85,00",
      image: "https://estudofacilitado.com.br/wp-content/uploads/2025/11/Direito-Bonus.png"
    },
    {
      id: "03",
      title: "Redação Nota Máxima",
      desc: "Estrutura passo a passo, conectivos estratégicos e como evitar os erros que tiram sua nota.",
      price: "R$55,00",
      image: "https://estudofacilitado.com.br/wp-content/uploads/2025/11/Tablet-Mockup-Redacao.png"
    },
    {
      id: "04",
      title: "400 Questões Comentadas",
      desc: "A prática leva à perfeição: questões selecionadas com gabarito e comentários fundamentais.",
      price: "R$60,00",
      image: "https://estudofacilitado.com.br/wp-content/uploads/2025/11/Tablets-questao-v2-bonus.png"
    }
  ];

  const learnItems = [
    { title: "Sintaxe e Gramática", text: "Crase, pontuação, regência, concordância e todas as classes gramaticais." },
    { title: "Interpretação de Texto", text: "Técnicas avançadas para entender o que a banca realmente está pedindo." },
    { title: "Bancas Estratégicas", text: "Conteúdo focado em FGV, FCC, Cebraspe, IBFC e Vunesp." },
    { title: "Estudo Mobile-First", text: "Formato ideal para revisar onde quiser — celular, tablet ou computador." },
    { title: "Direto ao Ponto", text: "Foco total no que realmente cai na prova, sem enrolação teórica." },
    { title: "Memorização Visual", text: "Organização visual pensada na retention rápida de conteúdos difíveis." },
    { title: "Nível Profissional", text: "Material ideal para concursos de nível médio e superior." },
    { title: "Revisão Acelerada", text: "A forma mais prática e rápida de revisar antes da sua prova." }
  ];

  const carouselImages = [
    "https://estudofacilitado.com.br/wp-content/uploads/2025/11/15.png",
    "https://estudofacilitado.com.br/wp-content/uploads/2025/11/16.png",
    "https://estudofacilitado.com.br/wp-content/uploads/2025/11/14.png",
    "https://estudofacilitado.com.br/wp-content/uploads/2025/11/12.png",
    "https://estudofacilitado.com.br/wp-content/uploads/2025/11/10.png",
    "https://estudofacilitado.com.br/wp-content/uploads/2025/11/7.png",
    "https://estudofacilitado.com.br/wp-content/uploads/2025/11/2.png",
    "https://estudofacilitado.com.br/wp-content/uploads/2025/11/9.png"
  ];

  const duplicatedItems = [...carouselImages, ...carouselImages];

  return (
    <div className="min-h-screen bg-white font-montserrat overflow-x-hidden text-slate-900 selection:bg-green-500 selection:text-white">

      {/* Top Bar - Vermelho Piscando */}
      <div className="animate-blink-red text-white text-[10px] md:text-xs font-black text-center py-2.5 uppercase tracking-[0.15em] border-b border-black/10">
        OFERTA DISPONÍVEL APENAS HOJE
      </div>

      {/* Hero Section */}
      <section className="bg-[#040814] text-white text-center pt-12 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] bg-blue-600 blur-[100px] rounded-full animate-glow-blue pointer-events-none z-0"></div>

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <div className="mb-8 inline-flex items-center gap-3 border-[1.5px] border-[#3a2216] bg-[#0b0e14] px-8 py-2 rounded-full">
            <BookOpen size={16} className="text-[#e67e22] fill-[#e67e22]/20" />
            <span className="text-[#e67e22] text-[10px] md:text-xs font-black uppercase tracking-[0.3em]">RESUMO COMPLETO</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-6 tracking-tight max-w-5xl relative">
            Domine Português <span className="text-[#3b82f6]">para Concursos </span> em até 7 dias
          </h1>

          <p className="text-[#94a3b8] mb-1 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-[1.5]">
            Mais de <span className="text-white font-black underline underline-offset-4 decoration-2">1.000 alunos</span> transformaram insegurança em aprovação em tempo recorde com esse método visual.
          </p>

          <div className="relative mb-2 group -mt-[30px]">
            <img
              src="https://estudofacilitado.com.br/wp-content/uploads/2025/11/Mockup-Super-Oferta-Portugues-02.png"
              className="w-full max-w-4xl mx-auto drop-shadow-[0_20px_60px_rgba(37,99,235,0.3)] transform transition-transform duration-700 hover:scale-[1.01]"
              alt="Mockup Super Oferta Português"
            />
          </div>

          <div className="w-full max-w-4xl -mt-[20px]">
            <div className="flex flex-row items-center justify-center gap-3 md:gap-6 text-xl md:text-3xl font-black whitespace-nowrap overflow-hidden">
              <span className="text-red-500 line-through shrink-0">De R$97</span>
              <span className="text-white shrink-0">por apenas</span>
              <span className="bg-gradient-to-br from-blue-600 to-blue-400 text-white px-4 md:px-6 py-1.5 rounded-xl text-3xl md:text-6xl shadow-[0_10px_30px_rgba(37,99,235,0.4)] shrink-0 font-black">R$10</span>
            </div>

            <div className="flex justify-center mt-[15px]">
              <button onClick={scrollToPricing} className="bg-[#10b981] text-white font-black text-lg md:text-xl px-12 md:px-16 py-7 md:py-8 rounded-[1.5rem] shadow-xl transition-all transform hover:-translate-y-1 hover:bg-[#059669] active:scale-95 uppercase tracking-tighter whitespace-nowrap">
                QUERO ADQUIRIR O MEU AGORA!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Materiais */}
      <div className="bg-slate-50 py-20 border-y border-gray-200 overflow-hidden relative">
        <h3 className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-12 relative z-10">Veja o material por dentro</h3>
        <div className="flex animate-scroll-left hover:[animation-play-state:paused] w-fit">
          <div className="flex gap-10 px-6">
            {duplicatedItems.map((imgUrl, index) => (
              <div
                key={index}
                className="min-w-[240px] md:min-w-[320px] aspect-[3/4.2] bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-500 hover:scale-110"
              >
                <img
                  src={imgUrl}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  alt={`Preview Material ${index}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 left-0 w-32 md:w-64 h-full bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 md:w-64 h-full bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* Material Único Section */}
      <Section className="text-center py-16">
        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase">VOCÊ RECEBERÁ UM MATERIAL ÚNICO</h2>
        <p className="text-gray-500 mb-16 text-lg md:text-xl font-medium">Totalmente organizado para facilitar a sua compreensão</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Zap size={32} />, label: "LEITURA RÁPIDA", color: "bg-yellow-500" },
            { icon: <CheckCircle2 size={32} />, label: "FÁCIL DE ENTENDER", color: "bg-green-500" },
            { icon: <Target size={32} />, label: "FOCO TOTAL NA PROVA", color: "bg-red-500" },
            { icon: <Search size={32} />, label: "REVISÃO COM CLAREZA", color: "bg-blue-600" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group cursor-pointer">
              <div className={`w-20 h-20 ${item.color} text-white rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:scale-125 group-hover:-rotate-3 group-hover:shadow-2xl active:scale-90`}>
                <div className="group-hover:animate-bounce-subtle">
                  {item.icon}
                </div>
              </div>
              <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-slate-900 uppercase transition-all duration-300 group-hover:text-blue-600 group-hover:translate-y-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* O QUE VOCÊ VAI APRENDER */}
      <Section className="bg-[#040814] text-white py-24 px-0 md:px-6 relative overflow-hidden border-y border-white/5 my-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 px-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-6">
              O QUE VOCÊ VAI <span className="text-[#3b82f6]">APRENDER...</span>
            </h2>
            <div className="w-24 h-1 bg-[#3b82f6] mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Esqueça métodos cansativos. Preparamos uma estrutura lógica para você nunca mais esquecer as regras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-0 border-t border-l border-white/10 mx-4 md:mx-0">
            {learnItems.map((item, i) => (
              <div key={i} className="group p-8 md:p-12 border-r border-b border-white/10 transition-all duration-300 hover:bg-white/[0.02]">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#3b82f6]/10 flex items-center justify-center rounded-2xl border border-[#3b82f6]/30 group-hover:bg-[#3b82f6] group-hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                    <CheckCircle2 size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter mb-3 group-hover:text-[#3b82f6] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-base md:text-lg leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center px-4">
            <button
              onClick={scrollToPricing}
              className="bg-[#10b981] hover:bg-[#059669] text-white font-black text-xl md:text-2xl px-12 md:px-20 py-8 md:py-9 rounded-[1.75rem] uppercase shadow-[0_20px_50px_rgba(16,185,129,0.2)] transition-all transform hover:-translate-y-2 active:scale-95 whitespace-nowrap"
            >
              GARANTIR MINHA VAGA AGORA!
            </button>
          </div>
        </div>
      </Section>

      {/* Bônus VIP */}
      <Section className="bg-slate-50 pt-[46px] pb-16">
        <div className="text-center mb-16 flex flex-col items-center max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 uppercase tracking-tighter text-slate-900 leading-[0.95] md:leading-[1]">
            Não acabou! Fizemos algo ainda melhor...
          </h2>
          <p className="text-lg md:text-2xl lg:text-3xl font-medium text-slate-600 mb-10 leading-tight">
            Leve mais <span className="text-blue-600 font-bold uppercase">4 BÔNUS EXCLUSIVOS</span> no Plano VIP
          </p>

          <div className="inline-flex items-center gap-4 md:gap-5 bg-yellow-100 border border-yellow-200 px-5 md:px-10 py-4 md:py-6 rounded-[1.75rem] shadow-sm transform transition-all hover:scale-[1.02] cursor-default max-w-full">
            <AlertTriangle className="text-yellow-600 shrink-0" size={32} />
            <p className="text-sm md:text-xl lg:text-2xl font-medium text-slate-800 tracking-tight leading-snug text-left">
              Válido somente para quem comprar nos dias <span className="font-black bg-yellow-400/30 px-1 rounded">{urgencyDates}</span>.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-8">
          {bonuses.map((bonus, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-3xl text-center shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl flex flex-col">
              <div className="w-full bg-gradient-to-b from-slate-50 to-white flex justify-center items-center overflow-hidden py-8">
                <img
                  src={bonus.image}
                  alt={bonus.title}
                  className="w-full h-auto max-w-[400px] mx-auto drop-shadow-lg transform transition-transform duration-700 hover:scale-105 px-6"
                />
              </div>

              <div className="p-8 flex-grow flex flex-col">
                <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100 self-center">BÔNUS {bonus.id}</div>
                <h3 className="text-2xl lg:text-3xl font-black mb-4 uppercase tracking-tight text-slate-900 leading-tight">{bonus.title}</h3>
                <p className="text-gray-500 text-base leading-relaxed mb-8 font-medium">{bonus.desc}</p>

                <div className="mt-auto border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">VALOR REAL</span>
                      <span className="text-gray-400 text-xl font-black line-through italic leading-none">{bonus.price}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-100"></div>
                    <div className="flex flex-col">
                      <span className="text-green-600 text-[10px] font-bold uppercase tracking-widest mb-1">NESTA OFERTA</span>
                      <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-xl font-black text-xl uppercase tracking-[0.1em] shadow-sm">GRÁTIS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TABELA DE PREÇOS */}
      <Section id="pricing" className="bg-[#0f172a] py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 blur-[150px] pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-none">
            Escolha o <span className="animate-gradient-text whitespace-nowrap">Melhor Plano</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start px-4 relative z-10">
          <div className="bg-black border-2 border-slate-800 rounded-[2.5rem] p-10 flex flex-col items-center opacity-85 mt-4">
            <h3 className="text-xl font-black mb-2 uppercase text-slate-300 tracking-widest">PLANO BÁSICO</h3>
            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-5xl font-black text-white">R$10</span>
            </div>

            <ul className="space-y-4 w-full mb-10 text-sm font-bold text-slate-300 divide-y divide-white/10">
              <li className="flex gap-4 items-center pb-3">
                <CheckCircle2 size={20} className="text-slate-400 shrink-0" />
                <span>RESUMO PORTUGUÊS DESCOMPLICADO</span>
              </li>
              <li className="flex gap-4 items-center py-3">
                <CheckCircle2 size={20} className="text-slate-400 shrink-0" />
                <span>7 DIAS DE GARANTIA</span>
              </li>
              <li className="flex gap-4 items-center py-3">
                <CheckCircle2 size={20} className="text-slate-400 shrink-0" />
                <span>6 MESES DE ACESSO</span>
              </li>
              <li className="flex gap-4 items-center pt-3 border-none text-red-500 uppercase">
                <XCircle size={20} className="shrink-0" />
                <span className="line-through decoration-red-500 text-red-500">NENHUM BÔNUS</span>
              </li>
            </ul>

            <button onClick={handleBasicPurchase} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-5 rounded-2xl uppercase tracking-wider transition-colors border border-slate-600 hover:border-slate-500">
              QUERO O BÁSICO
            </button>
          </div>

          <div className="flex flex-col items-center w-full">
            <div className="bg-yellow-400 text-slate-900 px-8 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-xl mb-[-15px] relative z-20">MELHOR OPÇÃO</div>

            <div id="vip-card" className="relative bg-white border-4 border-blue-600 rounded-[2.5rem] p-10 flex flex-col items-center shadow-2xl transform md:scale-105 z-10 transition-transform duration-500 animate-float-vip overflow-hidden group w-full">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-white pointer-events-none -z-10"></div>

              <div className="flex flex-col items-center gap-1 mb-6">
                <div className="flex gap-1 text-yellow-500">
                  <Star size={24} className="fill-yellow-500" /><Star size={24} className="fill-yellow-500" /><Star size={24} className="fill-yellow-500" /><Star size={24} className="fill-yellow-500" /><Star size={24} className="fill-yellow-500" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">4.79/5 (1.612 avaliações)</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter text-center animate-gradient-text">PLANO VIP</h3>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl md:text-7xl font-black text-blue-600 tracking-tighter">R$37</span>
              </div>

              <div className="w-full mt-[-20px] mb-[-20px]">
                <img
                  src="https://estudofacilitado.com.br/wp-content/uploads/2025/11/Mockup-Super-Oferta-Portugues-02.png"
                  className="w-full h-auto drop-shadow-xl"
                  alt="Mockup Plano VIP"
                />
              </div>

              <ul className="w-full divide-y divide-slate-100 mb-12 text-[14px] md:text-base text-slate-900 font-bold leading-tight uppercase relative z-10 mt-[20px]">
                <li className="flex gap-4 items-center text-blue-600 bg-blue-50/70 p-3 rounded-lg border border-blue-100 mb-2"><CheckCircle2 size={20} className="fill-blue-50 shrink-0" /> Todos os Itens Anteriores</li>
                <li className="flex gap-4 items-center py-3"><CheckCircle2 size={20} className="text-green-500 shrink-0" /> Acesso Vitalício</li>
                <li className="flex gap-4 items-center py-3"><CheckCircle2 size={20} className="text-green-500 shrink-0" /> 30 Dias de Garantia</li>
                <li className="flex gap-4 items-center py-3"><CheckCircle2 size={20} className="text-green-500 shrink-0" /> Área de Membros PREMIUM estilo Netflix</li>

                <li className="flex gap-4 items-center py-3">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <span>Resumo de Raciocínio Lógico <span className="text-red-500 line-through ml-1">R$55,00</span></span>
                </li>
                <li className="flex gap-4 items-center py-3">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <span>Resumo de Direito e Legislação <span className="text-red-500 line-through ml-1">R$85,00</span></span>
                </li>
                <li className="flex gap-4 items-center py-3">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <span>Redação Nota Máxima <span className="text-red-500 line-through ml-1">R$55,00</span></span>
                </li>
                <li className="flex gap-4 items-center py-3">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <span>Resumo de Informática <span className="text-red-500 line-through ml-1">R$40,00</span></span>
                </li>
                <li className="flex gap-4 items-center py-3">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <span>400 questões comentadas + Gabarito <span className="text-red-500 line-through ml-1">R$60,00</span></span>
                </li>
                <li className="flex gap-4 items-center py-3">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <span>Certificado de Especialista <span className="text-red-600 font-black ml-1">IMENSURÁVEL</span></span>
                </li>
                <li className="flex gap-4 items-center py-3">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <span>Cronograma de Estudos <span className="text-red-500 line-through ml-1">R$29,00</span></span>
                </li>
                <li className="flex gap-4 items-center py-3">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <span>Planilha de Controle de Estudos <span className="text-red-500 line-through ml-1">R$40,00</span></span>
                </li>
                <li className="flex gap-4 items-center py-3">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <span>Audiobook de todos os resumos <span className="text-red-500 line-through ml-1">R$87,00</span></span>
                </li>
                <li className="flex gap-4 items-center py-3 border-none">
                  <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                  <span>60 Provas de Concursos com Gabarito <span className="text-red-600 font-black ml-1">IMENSURÁVEL</span></span>
                </li>
              </ul>

              <button onClick={handleAcceptVIP} className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-black py-7 rounded-2xl uppercase text-2xl shadow-xl transition-all relative z-10">QUERO SER VIP!</button>

              <div className="mt-8 flex justify-center items-center gap-3 px-6 py-2 bg-blue-50 border border-blue-100 rounded-xl relative z-10 text-center">
                <span className="text-xs font-black text-blue-700 tracking-[0.1em] text-center">
                  Restam apenas <span className="text-red-600">{spotsLeft}</span> vagas nesse preço...
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12 max-w-2xl mx-auto space-y-4 px-4 relative z-10">
          <p className="text-xl md:text-2xl text-white font-bold leading-tight">
            👉 Aproveite agora. Você <span className="text-red-500">NÃO</span> vai encontrar essa oferta depois.
          </p>
          <p className="text-slate-300 font-medium text-lg">
            <span className="text-white font-black">Risco ZERO.</span> Se você não gostar do resumo, basta pedir o seu dinheiro de volta.
          </p>
        </div>
      </Section>

      {/* Summary Section */}
      <Summary />



      {/* FAQ */}
      <Section className="bg-[#0f172a] py-12 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">DÚVIDAS FREQUENTES</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          {[
            { q: "COMO RECEBEREI O MATERIAL?", a: "Imediatamente após a aprovação do seu pagamento, você receberá um e-mail com os dados de acesso à nossa Área de Membros exclusiva." },
            { q: "POR QUE SOMENTE R$10 NO PLANO BÁSICO?", a: "O valor não é por acaso. O preço de R$10 não se torna um obstáculo para ninguém que queira realmente aprender e ainda é uma proteção contra os curiosos. Mesmo que o investimento seja baixo, o simples fato de cobrar já afasta curiosos em busca de “soluções gratuitas” na internet. Para quem gostar do produto, fica com a confiança e a vontade de avançar conosco nessa jornada." },
            { q: "O PAGAMENTO É ÚNICO OU MENSAL?", a: "O PAGAMENTO É ÚNICO. Sem pegadinhas, sem mensalidades. Paga uma vez e estuda pelo tempo do plano escolhido." }
          ].map((item, i) => (
            <div key={i} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-white/20 bg-slate-900/50' : 'border-white/10 bg-white/5'}`}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className={`w-full p-6 text-left flex justify-between items-center group transition-all duration-500 ${openFaq === i
                  ? "bg-gradient-to-r from-white to-blue-400 text-blue-950"
                  : "text-white"
                  }`}
              >
                <span className="font-black text-base md:text-lg uppercase tracking-tighter">{item.q}</span>
                {openFaq === i ? <ChevronUp size={24} /> : <ChevronDown size={24} className="text-white/40 group-hover:text-white" />}
              </button>
              {openFaq === i && (
                <div className="p-6 text-slate-300 text-base leading-relaxed font-medium animate-in slide-in-from-top-2 duration-300">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-16 text-center">
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-40">PORTUGUÊS DESCOMPLICADO</h3>
        <p className="text-[10px] text-gray-800 uppercase tracking-[0.2em]">Todos os direitos reservados • {new Date().getFullYear()}</p>
      </footer>

      {/* POP-UP DE UPSELL */}
      {isUpsellOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setIsUpsellOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.3)] animate-in zoom-in-95 duration-300">
            <div className="bg-blue-600 py-4 text-center">
              <span className="text-white text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                <Flame size={14} className="fill-white" /> OFERTA EXCLUSIVA DE UPGRADE
              </span>
            </div>

            <div className="p-8 md:p-12 text-center">
              <h3 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter leading-none italic">
                ESPERA! <span className="text-blue-600">NÃO LEVE APENAS</span> O BÁSICO...
              </h3>
              <p className="text-slate-900 text-lg mb-8 font-medium">
                Por apenas <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent font-black">R$17</span> a mais, você garante o <span className="text-blue-600 font-black">ACESSO VITALÍCIO</span> e todos os bônus exclusivos.
              </p>

              <div className="space-y-6 mt-10">
                <button
                  onClick={handleAcceptUpgrade}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-black text-xl md:text-2xl py-7 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 uppercase italic tracking-tighter"
                >
                  SIM, FAZER O UPGRADE
                </button>
                <button
                  onClick={handleDeclineVIP}
                  className="text-slate-400 hover:text-slate-600 font-black text-sm uppercase tracking-widest transition-colors underline underline-offset-4"
                >
                  Não, prefiro continuar com o Plano Básico
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROVA SOCIAL */}
      <div className={`fixed bottom-24 md:bottom-6 left-6 z-[110] transition-all duration-700 transform ${showNotification ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
        {currentNotification && (
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-[320px]">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg">
              <ShoppingBag size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-slate-900 text-sm font-black leading-tight">
                {currentNotification.name}
              </p>
              <p className="text-slate-500 text-xs font-bold mb-1">
                {currentNotification.city}
              </p>
              <div className="flex items-center gap-2">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                  COMPROU O {currentNotification.plan}
                </span>
                <span className={`text-slate-400 text-[9px] flex items-center gap-1 font-bold ${currentNotification.time === 'AGORA' ? 'text-green-600' : ''}`}>
                  <Clock size={10} /> {currentNotification.time}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EXIT INTENT POPUP */}
      {isExitIntentOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" onClick={() => setIsExitIntentOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-slate-900 border-2 border-yellow-500 rounded-[2.5rem] p-8 md:p-12 text-center text-white shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center">
            <button onClick={() => setIsExitIntentOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X size={28} />
            </button>

            <div className="w-full mb-8 overflow-hidden rounded-2xl shadow-xl">
              <img
                src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjhyeXcyMWQ3bHE2b2V2bWJmOTNla3dsYnJhOHN1cXJxMHc4dXFwYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cKKXNlTYino7hWNXwl/giphy.gif"
                alt="Gif de Atenção"
                className="w-full h-auto"
              />
            </div>

            <h3 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tighter leading-tight italic">Calma aí, calabreso!</h3>

            <div className="space-y-4 mb-10">
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed font-medium">
                Você estava a um passo da sua aprovação... Mas deu pra trás?
              </p>
            </div>

            <button
              onClick={scrollToPricing}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-black text-xl md:text-2xl py-7 rounded-2xl transition-all uppercase shadow-[0_15px_30px_rgba(16,185,129,0.3)] transform hover:scale-105 active:scale-95"
            >
              OK, ME LEVE DE VOLTA!
            </button>
          </div>
        </div>
      )}

      {/* MOBILE FIXED CTA */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/98 backdrop-blur-xl border-t border-gray-100 z-[100] transition-all duration-500 transform ${showMobileCta ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
        <button onClick={scrollToVip} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-black py-5 rounded-xl shadow-2xl flex items-center justify-center gap-4 text-lg uppercase">
          QUERO ACESSO IMEDIATO!
        </button>
      </div>

    </div>
  );
};

export default App;
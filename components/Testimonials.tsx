
import React, { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Section } from './Section';

const testimonials = [
    {
        name: "Laíza Pimentel",
        text: "Estou amando a plataforma da Alura, consigo me empenhar e praticar os exercícios, professor totalmente didático e bem explicativo para não deixar nenhuma dúvida...",
        avatar: "LP"
    },
    {
        name: "Patrick Ribeiro",
        text: "Vários desafios de minha área foram supridos pelo conhecimento que desenvolvi lá...",
        avatar: "PR"
    },
    {
        name: "Juliana Américo",
        text: "Depois de participar da Imersão Dev Alura, no final de março, me apaixonei completamente pela programação, imediatamente me tornei aluna dela. Desde então, não tem um dia que eu não sinto vontade de aprender cada vez mais...",
        avatar: "JA"
    },
    {
        name: "Carlos Ferreira",
        text: "A didática é impressionante. Já havia tentado estudar por outros meios, mas somente aqui consegui realmente destravar meu aprendizado.",
        avatar: "CF"
    },
    {
        name: "Fernanda Costa",
        text: "O material é direto ao ponto. Sem enrolação. Consegui revisar todo o conteúdo de crase em uma tarde e gabaritei a prova.",
        avatar: "FC"
    }
];

export const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [trackOffset, setTrackOffset] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);

    // Calculate max index based on visible cards
    // This is a simplification; for a robust responsive carousel we often just clamp to length-1 or handle 'pages'.
    // Given user wants "1 click = 1 slide", we clamp to length - 1.

    const handlePrev = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(testimonials.length - 1, prev + 1));
    };

    useEffect(() => {
        const updateOffset = () => {
            if (trackRef.current) {
                const card = trackRef.current.children[0] as HTMLElement;
                if (card) {
                    const cardWidth = card.offsetWidth;
                    const gap = 24; // 1.5rem (gap-6)
                    const offset = currentIndex * (cardWidth + gap);
                    setTrackOffset(offset);
                }
            }
        };

        updateOffset();
        window.addEventListener('resize', updateOffset);
        return () => window.removeEventListener('resize', updateOffset);
    }, [currentIndex]);

    return (
        <Section className="bg-[#0f172a] text-white py-24 relative overflow-hidden border-t border-slate-800">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 relative z-10">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-6">
                        Conheça as histórias de <span className="text-blue-500">quem aprova</span> nosso método
                    </h2>
                    <div className="w-24 h-1.5 bg-blue-600 rounded-full"></div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`w-12 h-12 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center transition-all duration-300 group ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:border-blue-600 hover:scale-110 active:scale-95'}`}
                    >
                        <ChevronLeft size={24} className={`transition-colors ${currentIndex === 0 ? 'text-slate-600' : 'text-slate-400 group-hover:text-white'}`} />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === testimonials.length - 1}
                        className={`w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] ${currentIndex === testimonials.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:scale-110 active:scale-95'}`}
                    >
                        <ChevronRight size={24} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Carousel Track Container */}
            <div className="overflow-hidden -mx-4 px-4 md:mx-0 md:px-0">
                <div
                    ref={trackRef}
                    className="flex gap-6 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{ transform: `translateX(-${trackOffset}px)` }}
                >
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-blue-600 rounded-[2rem] p-8 md:p-10 flex flex-col justify-between transform transition-all hover:scale-[1.01] shadow-xl relative overflow-hidden group min-h-[320px]"
                        >
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-50 -mr-10 -mt-10 pointer-events-none"></div>

                            <div className="relative z-10 flex-grow">
                                <Quote size={48} className="text-blue-400/30 mb-6 fill-current" />
                                <p className="text-lg md:text-xl font-medium leading-relaxed mb-8 text-blue-50 w-full break-words">
                                    "{t.text}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 relative z-10 border-t border-blue-500 pt-6 mt-auto">
                                <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center font-black text-blue-200 border-2 border-blue-500 shrink-0">
                                    {t.avatar}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-white text-lg leading-none mb-1 truncate">{t.name}</p>
                                    <div className="flex gap-0.5">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

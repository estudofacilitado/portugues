
import React from 'react';
import { Section } from './Section';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const Summary: React.FC = () => {
    const scrollToPricing = () => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Section className="bg-white text-slate-900 py-24 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl bg-blue-100/40 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="text-center mb-12 relative z-10 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">Resumindo…</h2>
                <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
                    Pode ser a última vez que você vê esta página, então vou ser direto: <span className="text-slate-900 font-bold">faça sua inscrição agora</span> e comece ainda hoje a dominar o Português que mais cai nos concursos — de forma simples, prática e sem sofrimento.
                </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 max-w-5xl mx-auto relative z-10 mb-16 shadow-lg">
                <p className="text-xl md:text-2xl text-center font-medium leading-relaxed mb-12 text-slate-700">
                    A proposta é simples: Você vai <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">dominar o Português que realmente cai nas provas em até 7 dias</span> — sem decorar regras, sem apostilas confusas e sem perder tempo com conteúdo inútil.
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* O que não precisa */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase text-red-500 tracking-wide mb-4">
                            Você não precisa:
                        </h3>
                        <ul className="space-y-4">
                            {[
                                "Estudar por apostilas gigantes e confusas",
                                "Ficar pulando de regra em regra sem entender nada",
                                "Passar horas vendo aulas que só enrolam",
                                "Gastar meses tentando aprender o básico",
                                "Travar e errar questões simples na prova"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 text-slate-600 font-medium items-start">
                                    <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* O que precisa */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase text-green-600 tracking-wide mb-4">
                            Você só precisa:
                        </h3>
                        <ul className="space-y-4">
                            {[
                                "Seguir um método prático, direto ao ponto",
                                "Estudar exatamente o que as bancas cobram",
                                "Aplicar o conteúdo com confiança na prova"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 text-slate-900 font-bold items-start">
                                    <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center max-w-3xl mx-auto relative z-10">
                <h3 className="text-2xl md:text-3xl font-black mb-4 text-slate-900">E se não for tudo o que prometi?</h3>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                    Você tem <span className="text-slate-900 font-bold">7 dias de garantia</span> para pedir seu dinheiro de volta — sem burocracia, sem risco.
                </p>

                <p className="text-slate-600 mb-6 font-medium">
                    Clique no botão abaixo e tenha <b>acesso imediato a tudo</b>. A chance está aqui. Só falta você dar o próximo passo.
                </p>

                <button
                    onClick={scrollToPricing}
                    className="bg-[#10b981] hover:bg-[#059669] text-white font-black text-xl md:text-2xl px-10 py-6 rounded-[1.5rem] uppercase shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-2 active:scale-95 whitespace-nowrap flex items-center justify-center gap-3 mx-auto"
                >
                    QUERO ACESSO IMEDIATO <ArrowRight className="stroke-[3px]" />
                </button>
            </div>
        </Section>
    );
};

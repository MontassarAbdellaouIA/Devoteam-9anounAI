import Navbar from '@/components/Navbar';
import AgentWheel from '@/components/AgentWheel';
import AgentGrid from '@/components/AgentGrid';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff] text-slate-800 font-sans relative">
      
      {/* Conteneur pour les arrière-plans (blobs) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-100/50 blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#F8485E]/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[50vw] rounded-full bg-blue-100/40 blur-[150px]" />
      </div>
      
      <Navbar />

      <main className="flex-grow relative z-10 flex flex-col">
        
        {/* HERO SECTION */}
        <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm text-sm text-slate-700 font-semibold mb-8">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F8485E] opacity-50"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F8485E]"></span>
            </span>
            Nouvelle ère pour la finance et le droit en Tunisie
          </div>
          
          <h1 className="text-5xl md:text-[5rem] font-black tracking-tight mb-8 leading-[1.1] text-slate-900">
            Générez de la valeur avec <br />
            l'IA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8485E] to-[#ff7e8e]">Générative.</span>
          </h1>
          
          <p className="max-w-2xl text-xl text-slate-600 mb-10 leading-relaxed">
            Centralisez des agents d'IA ultra-spécialisés (JORT, BCT, CMF) pour automatiser vos processus de conformité et décupler l'efficacité de vos équipes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#agents" className="px-8 py-4 rounded-full bg-[#F8485E] hover:bg-[#e03a4f] text-white font-bold text-lg transition-all shadow-[0_15px_30px_rgba(248,72,94,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2">
              Demander un accès <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 rounded-full bg-white hover:bg-gray-50 text-slate-800 font-bold text-lg transition-all shadow-sm border border-gray-200 flex items-center justify-center gap-2">
              Voir la démo
            </button>
          </div>

          {/* INTERACTIVE ROTATING WHEEL */}
          <div className="w-full mt-12" id="wheel">
            <AgentWheel />
          </div>
        </section>

        {/* AGENTS GRID SECTION */}
        <section id="agents" className="py-24 px-6 max-w-7xl mx-auto w-full">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Meilleurs insights.<br/>Meilleurs résultats.</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">
               Des modèles propriétaires entraînés sur plus de 100,000 documents juridiques et financiers tunisiens pour une précision inégalée.
            </p>
          </div>
          <AgentGrid />
        </section>

        {/* SPLIT SECTION: HOW IT WORKS / WHY US */}
        <section className="py-24 bg-white/40 backdrop-blur-xl border-t border-white/60">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Text */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-slate-900">
                Vos experts sont bons,<br/>My 9anoun AI les rend <span className="text-[#F8485E]">excellents.</span>
              </h2>
              <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                Ne perdez plus des heures à fouiller dans les circulaires de la BCT ou les décrets du JORT. Nos agents IA analysent de grands volumes de données de manière contextuelle pour vous livrer la bonne information, au bon moment.
              </p>
              
              <ul className="space-y-6 mb-12">
                {[
                  { title: "Compréhension Contextuelle Profonde", desc: "Contrairement aux moteurs de recherche classiques, l'IA comprend les nuances de la loi tunisienne." },
                  { title: "Veille Réglementaire Automatisée", desc: "Soyez alerté instantanément dès qu'une nouvelle norme impacte votre activité." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 bg-[#F8485E]/10 p-2 rounded-full h-fit text-[#F8485E]">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <button className="px-8 py-4 rounded-full bg-[#1e293b] hover:bg-slate-900 text-white font-bold transition-all shadow-xl">
                 Découvrir l'Architecture
              </button>
            </div>

            {/* Right Mockup UI */}
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-br from-[#F8485E]/20 to-blue-500/20 blur-3xl rounded-[3rem]" />
               <div className="relative p-8 rounded-[2.5rem] bg-white/80 backdrop-blur-2xl border border-white shadow-xl">
                  
                  {/* Mock Header */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F8485E] to-[#ff7e8e] flex items-center justify-center text-white font-bold text-xl">R</div>
                      <div>
                        <h5 className="font-bold text-slate-900">Responsable Conformité</h5>
                        <p className="text-xs text-slate-500">Département Légal</p>
                      </div>
                    </div>
                    <div className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">100% Conforme</div>
                  </div>

                  {/* Mock Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <FileText className="w-6 h-6 text-[#F8485E] mb-3" />
                        {/* Section modifiée ici */}
                        <p className="text-xl md:text-2xl font-black text-slate-900">Instantané</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">TEMPS D'ANALYSE LÉGALE</p>
                     </div>
                     <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <ShieldCheck className="w-6 h-6 text-blue-500 mb-3" />
                        <p className="text-2xl font-black text-slate-900">0 Risque</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">PÉNALITÉ ÉVITÉE</p>
                     </div>
                  </div>

                  {/* Mock Alert */}
                  <div className="p-5 rounded-2xl bg-[#F8485E]/5 border border-[#F8485E]/20 flex gap-4">
                    <Sparkles className="w-6 h-6 text-[#F8485E] shrink-0" />
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <strong className="text-[#F8485E]">Analyse IA :</strong> Le rapprochement avec la nouvelle circulaire B.C.T a permis d'identifier et de mettre à jour automatiquement 3 clauses contractuelles vulnérables.
                    </p>
                  </div>

               </div>
            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200/60 py-8 bg-white relative z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Image 
              src="/devoteam.png" 
              alt="Logo Devoteam" 
              width={24}
              height={24} 
              className="object-contain"
            />
            <span className="font-bold text-slate-900">My 9anoun AI</span>
          </div>
                    
          <p className="text-slate-500 text-sm">© 2026 Devoteam. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-[#F8485E] transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-[#F8485E] transition-colors">Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
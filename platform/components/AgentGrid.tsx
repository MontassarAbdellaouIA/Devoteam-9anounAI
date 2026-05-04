import Link from 'next/link';
import Image from 'next/image';
import { agents } from '@/lib/data';
import { ArrowUpRight } from 'lucide-react';

export default function AgentGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {agents.map((agent) => {
        
        const CardBody = (
          <div className="group h-full p-8 rounded-[2rem] bg-white/70 backdrop-blur-xl border border-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(248,72,94,0.15)] hover:border-[#F8485E]/30 transition-all duration-500 relative overflow-hidden flex flex-col cursor-pointer">
            
            <div className="flex justify-between items-start mb-6">
              {/* Conteneur Logo Agrandissement massif : w-24 h-24 au lieu de w-16 h-16 */}
              <div className="w-24 h-24 relative flex items-center justify-center">
                {agent.logo ? (
                  <Image src={agent.logo} alt={agent.name} fill className="object-contain p-1" sizes="96px" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gray-50 flex items-center justify-center text-[#F8485E] border border-gray-100">
                    <agent.icon className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#F8485E] group-hover:text-white text-gray-400 transition-colors shadow-sm">
                 <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>

            {/* Titre et description en FR avec typographie plus marquée */}
            <h3 className="text-2xl font-black text-slate-900 mb-3">{agent.fullName}</h3>
            <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-grow">
              {agent.desc}
            </p>

            <div className="pt-6 border-t border-gray-100 flex items-end justify-between gap-2 mt-auto">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Statut</span>
                {/* Statut dynamique en FR */}
                <span className="text-base font-black text-slate-800">
                  {agent.externalUrl ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                      En ligne
                    </span>
                  ) : (
                    "Bientôt disponible"
                  )}
                </span>
              </div>
              
              {/* Mini Graphique décoratif */}
              <div className="flex items-end gap-1.5 h-10">
                {[40, 70, 45, 90, 65, 100].map((height, i) => (
                  <div key={i} className="w-2 bg-[#F8485E]/10 rounded-t-sm relative" style={{ height: '100%' }}>
                     <div className="absolute bottom-0 w-full bg-[#F8485E] rounded-t-sm transition-all duration-500 group-hover:bg-slate-900" style={{ height: `${height}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

        return agent.externalUrl ? (
          <a key={agent.id} href={agent.externalUrl} target="_blank" rel="noopener noreferrer">
            {CardBody}
          </a>
        ) : (
          <Link key={agent.id} href={`/agents/${agent.id}`}>
            {CardBody}
          </Link>
        );
      })}
    </div>
  );
}
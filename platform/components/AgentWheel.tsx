'use client';
import { motion, useAnimationControls } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { agents } from '@/lib/data';
// Remplacement de Cpu par Brain (ou Bot, BrainCircuit)
import { Brain, Sparkles } from 'lucide-react'; 
import { useEffect, useState } from 'react';

const rotationDuration = 40;

export default function AgentWheel() {
  const wheelControls = useAnimationControls();
  const agentControls = useAnimationControls();
  const [isHoveringWheel, setIsHoveringWheel] = useState(false);

  useEffect(() => {
    if (!isHoveringWheel) {
      wheelControls.start({
        rotate: [0, 360],
        transition: { duration: rotationDuration, ease: "linear", repeat: Infinity },
      });
      agentControls.start({
        rotate: [0, -360],
        transition: { duration: rotationDuration, ease: "linear", repeat: Infinity },
      });
    } else {
      wheelControls.stop();
      agentControls.stop();
    }
  }, [isHoveringWheel, wheelControls, agentControls]);

  return (
    <div 
      className="relative w-full max-w-[800px] aspect-square mx-auto flex items-center justify-center my-16"
      onMouseEnter={() => setIsHoveringWheel(true)}
      onMouseLeave={() => setIsHoveringWheel(false)}
    >
      {/* Orbites décoratives */}
      <div className="absolute inset-0 border-[1.5px] border-dashed border-[#F8485E]/20 rounded-full scale-[0.85]" />
      <div className="absolute inset-0 border-[1px] border-amber-500/20 rounded-full scale-[0.55]" />

      {/* Hub Central - Agrandissement */}
      <motion.div 
        className="absolute z-30 w-64 h-64 rounded-full bg-white/40 backdrop-blur-md flex flex-col items-center justify-center border border-white shadow-[0_0_80px_rgba(248,72,94,0.15)]"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Cube central plus grand (w-32 h-32 au lieu de 28) */}
        <div className="relative w-32 h-32 mb-3 rounded-[2rem] bg-gradient-to-br from-[#F8485E] to-[#d12c41] flex items-center justify-center shadow-2xl border border-white/30">
            <Image
                src="/Layer 1.png" // Assurez-vous d'avoir une version optimisée de votre image ici
                alt="Central AI Chip Processor"
                width={100} // Taille équivalente à w-20, adaptée à la boîte de 32
                height={100}
                className="object-contain"
            />
        </div>
        <span className="relative text-slate-900 font-black text-base tracking-widest uppercase">Agents IA</span>
      </motion.div>

      {/* Agents rotatifs */}
      <motion.div className="absolute inset-0 z-20" animate={wheelControls}>
        {agents.map((agent, index) => {
          const angle = (index * (360 / agents.length)) * (Math.PI / 180);
          const radius = 330;
          const x = (Math.cos(angle) * radius).toFixed(2);
          const y = (Math.sin(angle) * radius).toFixed(2);

          const CardContent = (
            <motion.div
              className="w-36 h-44 rounded-3xl bg-white/95 backdrop-blur-xl border border-gray-200 flex flex-col items-center justify-between p-4 shadow-xl group cursor-pointer hover:shadow-[0_20px_40px_rgba(248,72,94,0.2)] hover:border-[#F8485E] hover:scale-110 transition-all duration-300"
              animate={agentControls}
            >
              {/* Conteneur du logo agrandi (h-24 au lieu de h-20) */}
              <div className="relative w-full h-24 mt-1 flex items-center justify-center">
                {agent.logo ? (
                  <Image src={agent.logo} alt={agent.name} fill className="object-contain" sizes="96px" />
                ) : (
                  <agent.icon className="w-12 h-12 text-slate-300" />
                )}
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest text-center mt-2">
                {agent.name}
              </span>
            </motion.div>
          );

          return (
            <motion.div
              key={agent.id}
              className="absolute z-20"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
            >
              {agent.externalUrl ? (
                <a href={agent.externalUrl} target="_blank" rel="noopener noreferrer">{CardContent}</a>
              ) : (
                <Link href={`/agents/${agent.id}`}>{CardContent}</Link>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
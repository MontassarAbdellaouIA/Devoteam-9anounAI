import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 group">
          {/* Nouveau Logo Devoteam */}
          <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform">
            <Image 
              src="/devoteam.png" 
              alt="Logo_Devoteam" 
              width={40} // Tu peux augmenter ou réduire cette valeur (ex: 48, 32)
              height={40} // selon les proportions exactes de ton image
              className="object-contain"
            />
          </div>
          
          <span className="text-2xl font-black tracking-tight text-slate-900">
            My 9anoun <span className="text-[#F8485E]">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex gap-10 text-sm font-bold text-slate-600">
          <Link href="#agents" className="hover:text-[#F8485E] transition-colors">Catalogue IA</Link>
          <Link href="#how-it-works" className="hover:text-[#F8485E] transition-colors">Comment ça marche</Link>
          <Link href="#features" className="hover:text-[#F8485E] transition-colors">À propos</Link>
        </div>
        
        <button className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all shadow-md">
          Connexion
        </button>
      </div>
    </nav>
  );
}
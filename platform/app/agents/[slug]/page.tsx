import { agents } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AgentPage({ params }: { params: { slug: string } }) {
  const agent = agents.find((a) => a.id === params.slug);

  if (!agent) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#F8485E]/30">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Agent Identity */}
          <div>
            <div className="w-20 h-20 rounded-2xl bg-[#F8485E]/10 border border-[#F8485E]/20 flex items-center justify-center text-[#F8485E] mb-8">
              <agent.icon className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{agent.fullName}</h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              {agent.desc}
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-4 rounded-full bg-[#F8485E] hover:bg-[#ff5a70] text-white font-semibold transition-all">
                Subscribe to Agent
              </button>
              <button className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all">
                View Documentation
              </button>
            </div>
          </div>

          {/* Agent Capabilities Card */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6">Core Capabilities</h3>
            <ul className="space-y-4">
              {[
                "Real-time semantic search of regulatory texts",
                "Automated compliance checking",
                "Summarization of complex circulars",
                "API endpoint access for enterprise integration"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-[#F8485E] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
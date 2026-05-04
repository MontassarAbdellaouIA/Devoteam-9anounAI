import { BookOpen, Landmark, TrendingUp, ShieldCheck, Search, Briefcase } from 'lucide-react';

export const agents = [
  {
    id: 'jort',
    name: 'J.O.R.T IA',
    fullName: 'J.O.R.T IA-isation',
    desc: 'Maîtrise du Journal Officiel et des décrets de la République Tunisienne.',
    icon: BookOpen,
    logo: '/JORT.png', 
  },
  {
    id: 'bct',
    name: 'B.C.T IA',
    fullName: 'B.C.T IA-isation',
    desc: 'Cadre légal et circulaires de la Banque Centrale de Tunisie.',
    icon: Landmark,
    logo: '/BCT.png',
    externalUrl: 'https://bct-regulatory-assistant-ai-fronten.vercel.app/',
  },
  {
    id: 'cmf',
    name: 'C.M.F IA',
    fullName: 'C.M.F IA-isation',
    desc: 'Régulation du Conseil du Marché Financier Tunisien.',
    icon: TrendingUp,
    logo: '/CMF.png',
  },
  {
    id: 'cga',
    name: 'CGA IA',
    fullName: 'C.G.A IA-isation',
    desc: 'Normes et lois du Comité Général des Assurances.',
    icon: ShieldCheck,
    logo: '/CGA.png',
  },
  {
    id: 'ctaf',
    name: 'C.T.A.F IA',
    fullName: 'C.T.A.F IA-isation',
    desc: 'Analyse financière et lutte contre le blanchiment d\'argent.',
    icon: Search,
    logo: '/CTAF.png',
  },
  {
    id: 'acm',
    name: 'A.C.M IA',
    fullName: 'A.C.M IA-isation',
    desc: 'Contrôle de la microfinance et sécurité des transactions.',
    icon: Briefcase,
    logo: '/ACM.png',
  },
];
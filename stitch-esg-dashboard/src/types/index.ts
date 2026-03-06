export interface ESGScore {
  environmental: number;
  social: number;
  governance: number;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  region: string;
  currentXP: number;
  lastXP?: number; // For level up detection
  level: number;
  esgScores: ESGScore;
  evolutionData?: { month: string; score: number }[];
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  companyId: string;
  role: string;
  avatarUrl: string;
}

export interface Mission {
  id: string;
  companyId: string;
  title: string;
  status: 'concluido' | 'em_curso' | 'pendente';
  leader: string;
  deadline: string;
  type: 'E' | 'S' | 'G';
}

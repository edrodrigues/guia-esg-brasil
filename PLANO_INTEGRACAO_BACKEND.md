# Plano de Integração com Backend - Guia ESG Brasil

Este documento descreve o plano passo a passo para integrar todas as páginas e componentes com dados reais do backend (Firebase/Firestore).

---

## 📋 Visão Geral

### Status Atual (Atualizado: Março 2026)

| Página | Status Atual | Ação Necessária |
|--------|-------------|-----------------|
| DashboardPage | ✅ Integrado | Manter |
| DiagnosticPage | ✅ Integrado | Manter |
| EnvironmentalPage | ✅ Integrado | Dados dinâmicos implementados |
| SocialPage | ✅ Integrado | Missões e evolução implementados |
| GovernancePage | ✅ Integrado | Missões e evolução implementados |
| ReportsPage | ✅ Integrado | Comparações regionais/setoriais + Exportação PDF |
| RankingPage | ✅ Integrado | Manter |
| ProfilePage | ✅ Integrado | Manter |
| OrganizationPage | ✅ Integrado | Manter |
| LoginPage | ✅ Integrado | Manter |
| RegisterPage | ✅ Integrado | Manter |
| LandingPage | ❌ Estático | Nenhuma ação (página pública) |
| SettingsPage | ✅ Implementado | Funcionalidades implementadas (localStorage) |
| Fase 7 - Componentes | ✅ Completo | EvolutionChart + RecentMissions com filtros e paginação |
| Fase 8 - Sync | ✅ Completo | Real-time hooks + Cloud Functions + Offline support |
| CompliancePage | ❌ Estático | Nenhuma ação (conteúdo estático) |
| PrivacidadePage | ❌ Estático | Nenhuma ação (conteúdo estático) |
| TermosPage | ❌ Estático | Nenhuma ação (conteúdo estático) |

---

## ✅ Progresso - Implementação Concluída

### Fase 1: Infraestrutura de Dados ✅
- [x] Atualizar tipos em `src/types/index.ts` (ESGSubScores, EvolutionDataPoint, UserPreferences)
- [x] Criar hook `src/hooks/useCompanyData.ts`
- [x] Criar hook `src/hooks/useMissions.ts`
- [x] Criar hook `src/hooks/useSubScores.ts`
- [x] Criar `src/hooks/index.ts` para exportar hooks

### Fase 2: EnvironmentalPage ✅
- [x] Remover `chartData` constante
- [x] Implementar `useMemo` para dados dinâmicos de evolução
- [x] Buscar dados de evolução do Firestore (`company.evolutionData`)
- [x] Implementar fallback para dados vazios
- [x] Buscar missões reais do Firestore (type: 'E')

### Fase 3: SocialPage ✅
- [x] Remover `chartData` constante
- [x] Buscar missões da empresa do Firestore
- [x] Implementar dados de evolução social dinâmica
- [x] Renderizar missões reais ou fallback

### Fase 4: GovernancePage ✅
- [x] Remover `chartData` constante
- [x] Buscar missões de governança do Firestore
- [x] Implementar dados de evolução governança dinâmica

### Fase 5: ReportsPage ✅
- [x] Implementar comparação regional com médias em tempo real
- [x] Implementar ranking setorial com percentil
- [x] Calcular emissões de carbono (escopos 1, 2, 3) das respostas
- [x] Gráfico de carbono comparativo (empresa vs setor vs regional)
- [x] Implementar exportação de relatórios em PDF (jsPDF)
- [x] Adicionar cards de benchmarking visual
- [x] Donut chart comparativo de performance

### Fase 6: SettingsPage ✅
- [x] Implementar tema (light/dark/system) com aplicação em tempo real
- [x] Persistir preferências no localStorage
- [x] Toggle switches para notificações
- [x] Visualização de configurações atuais

### Fase 7: Componentes Compartilhados ✅
- [x] EvolutionChart com tabs de pilares (Todos, E, S, G)
- [x] EvolutionChart com filtro de período (6 meses / Todos)
- [x] EvolutionChart com modo de comparação multi-pilar
- [x] RecentMissions convertido para self-fetching
- [x] RecentMissions com filtros de pilar e contadores
- [x] RecentMissions com paginação (Carregar Mais)
- [x] RecentMissions com empty state melhorado

### Fase 8: Sincronização de Dados ✅
- [x] Criar hook useRealtimeCompany com onSnapshot
- [x] Criar hook useRealtimeMissions com atualizações em tempo real
- [x] Criar hook useRealtimeMission para missão individual
- [x] Criar hook useOfflineStatus para detectar estado de conexão
- [x] Adicionar indicador offline no Header
- [x] Habilitar persistência offline do Firestore
- [x] Criar projeto Firebase Cloud Functions
- [x] Implementar função calculateRegionalAverages (manual + scheduled)
- [x] Implementar função updateEvolutionData (manual + scheduled)
- [x] Configurar agendamento semanal para regional averages (segunda 9h)
- [x] Configurar agendamento mensal para evolution data (dia 1, 00:00)

---

## 🗂️ Estrutura de Dados Firestore

### Collections Existentes

```
users/{userId}
├── uid: string
├── name: string
├── email: string
├── companyId: string
├── role: string
├── avatarUrl: string
├── preferences?: { ... }
└── notificationSettings?: { ... }

companies/{companyId}
├── name: string
├── industry: string
├── region: string
├── currentXP: number
├── level: number
├── esgScores: { environmental, social, governance }
├── esgDelta?: { environmental, social, governance }
├── goals?: { energia, residuos, diversidade, etica }
├── evolutionData?: [{ month, score }]
├── environmentalSubScores?: { sga, energia, agua, ... }
├── socialSubScores?: { … }
├── governanceSubScores?: { … }
├── lastEnvironmentalUpdate?: Timestamp
├── lastSocialUpdate?: Timestamp
└── lastGovernanceUpdate?: Timestamp

diagnostics/{diagnosticId}
├── companyId: string
├── responses: Record<string, any>
├── completed: boolean
├── completedAt?: Timestamp
└── lastUpdated: Timestamp

missions/{missionId}
├── companyId: string
├── title: string
├── status: 'concluido' | 'em_curso' | 'pendente'
├── leader: string
├── deadline: string
├── type: 'E' | 'S' | 'G'
└── description?: string
```

### Novas Collections Necessárias

```
userPreferences/{userId}
├── theme: 'light' | 'dark' | 'system'
├── notifications: {
│   ├── weeklyReport: boolean
│   ├── missionUpdates: boolean
│   └── scoreChanges: boolean
│ }
├── language: string
└── updatedAt: Timestamp

evolutionHistory/{historyId}
├── companyId: string
├── pillar: 'E' | 'S' | 'G'
├── month: string
├── year: number
├── score: number
└── createdAt: Timestamp

regionalAverages/{regionId}
├── region: string
├── avgEnvironmental: number
├── avgSocial: number
├── avgGovernance: number
├── totalCompanies: number
└── updatedAt: Timestamp
```

---

## 🚀 Fase 1: Infraestrutura de Dados

### 1.1 Atualizar Tipo Company

**Arquivo:** `src/types/index.ts`

```typescript
export interface ESGSubScores {
  // Environmental
  sga: number;          // Sistema de Gestão Ambiental
  energia: number;       // Energia
  agua: number;          // Água e Efluentes
  residuos: number;      // Gestão de Resíduos
  arClima: number;       // Ar e Clima (GEE)
  materiaPrima: number;  // Matéria-Prima
  cicloVida: number;     // Ciclo de Vida
  biodiversidade: number; // Biodiversidade
  
  // Social
  direitosHumanos: number;
  praticasTrabalhistas: number;
  saudeSeguranca: number;
  treinamento: number;
  diversidade: number;
  comunidade: number;
  
  // Governance
  culturaValores: number;
  gestaoRiscos: number;
  conformidade: number;
  etica: number;
  transparencia: number;
}

export interface EvolutionDataPoint {
  month: string;
  year: number;
  environmental: number;
  social: number;
  governance: number;
  average: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    weeklyReport: boolean;
    missionUpdates: boolean;
    scoreChanges: boolean;
  };
  language: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  region: string;
  currentXP: number;
  lastXP?: number;
  level: number;
  esgScores: ESGScore;
  esgDelta?: ESGDelta;
  goals?: CompanyGoals;
  evolutionData?: EvolutionDataPoint[];
  environmentalSubScores?: ESGSubScores;
  socialSubScores?: ESGSubScores;
  governanceSubScores?: ESGSubScores;
  lastEnvironmentalUpdate?: Date;
  lastSocialUpdate?: Date;
  lastGovernanceUpdate?: Date;
}
```

### 1.2 Criar Hooks Customizados

**Arquivo:** `src/hooks/useCompanyData.ts`

```typescript
import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import type { Company } from '../types';

export function useCompanyData(subscribe = false) {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const fetchCompany = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          setLoading(false);
          return;
        }

        const companyId = userDoc.data().companyId;

        if (subscribe) {
          unsubscribe = onSnapshot(
            doc(db, 'companies', companyId),
            (snapshot) => {
              if (isMounted && snapshot.exists()) {
                setCompany({ id: snapshot.id, ...snapshot.data() } as Company);
              }
            },
            (err) => {
              if (isMounted) setError(err);
            }
          );
        } else {
          const companyDoc = await getDoc(doc(db, 'companies', companyId));
          if (isMounted && companyDoc.exists()) {
            setCompany({ id: companyDoc.id, ...companyDoc.data() } as Company);
          }
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCompany();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [user, subscribe]);

  return { company, loading, error };
}
```

**Arquivo:** `src/hooks/useEvolutionData.ts`

```typescript
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import type { EvolutionDataPoint } from '../types';

export function useEvolutionData(pillar?: 'E' | 'S' | 'G') {
  const { user } = useAuth();
  const [data, setData] = useState<EvolutionDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        // Buscar do documento da empresa primeiro
        const { useCompanyData } = await import('./useCompanyData');
        // Implementation...
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [user, pillar]);

  return { data, loading, error };
}
```

---

## 📊 Fase 2: EnvironmentalPage

### 2.1 Substituir chartData Mock por Dados Reais

**Tarefas:**

1. **Criar função de geração de evolução mensal**
   - Arquivo: `src/utils/evolutionGenerator.ts`
   - Gerar dados de evolução baseados nas respostas do diagnóstico
   - Calcular scores por mês para os últimos 12 meses

2. **Atualizar EnvironmentalPage**
   - Remover constante `chartData`
   - Buscar dados de evolução de `company.evolutionData`
   - Se não existir, gerar dados baseados nas respostas do diagnóstico

3. **Criar sub-scores (environmentalSubScores)**
   - Calcular pontuação por pilar (SGA, Energia, Água, etc.)
   - Armazenar no documento da empresa
   - Atualizar após cada diagnóstico

**Arquivo:** `src/pages/EnvironmentalPage.tsx`

```typescript
// Antes
const chartData = [
  { date: 'JAN', 'Eficiência': 45 },
  // ...
];

// Depois
const chartData = useMemo(() => {
  if (!company?.evolutionData || company.evolutionData.length === 0) {
    // Gerar dados iniciais baseados no score atual
    return generateDefaultEvolutionData(company?.esgScores?.environmental || 0);
  }
  
  return company.evolutionData.map(point => ({
    date: point.month,
    'Eficiência': point.environmental,
    'Média Setor': Math.round(point.environmental * 0.85), // 85% do score como média de referência
  }));
}, [company]);
```

### 2.2 Implementar Atualização de Scores por Pilar

**Arquivo:** `src/utils/calculateSubScores.ts`

```typescript
import type { Question } from '../types';

interface SubScoreWeights {
  [key: string]: {
    questions: string[];
    weight: number;
  };
}

export const ENVIRONMENTAL_SUBSCORE_WEIGHTS: SubScoreWeights = {
  sga: {
    questions: ['environmental_2.1', 'environmental_2.2', 'environmental_2.3'],
    weight: 1
  },
  energia: {
    questions: ['environmental_3.1', 'environmental_3.2', 'environmental_3.3', 'environmental_3.4'],
    weight: 1.2
  },
  agua: {
    questions: ['environmental_4.1', 'environmental_4.2', 'environmental_4.3', 'environmental_4.4', 'environmental_4.5', 'environmental_4.6', 'environmental_4.7'],
    weight: 1
  },
  // ... continuar para outros pilares
};

export function calculateSubScores(
  responses: Record<string, number | string | (string | number)[]>,
  questions: Question[],
  pillar: 'environmental' | 'social' | 'governance'
): Record<string, number> {
  // Implementation
}
```

---

## 👥 Fase 3: SocialPage

### 3.1 Substituir chartData e Missões Mock

**Tarefas:**

1. **Implementar busca de missões da empresa**
   - Query na collection `missions` por `companyId`
   - Filtrar por status se necessário

2. **Substituir chartData**
   - Buscar de `company.evolutionData`
   - Filtrar por pillar 'S' (Social)

3. **Calcular socialSubScores**
   - Sub-scores para: direitosHumanos, praticasTrabalhistas, etc.

**Arquivo:** `src/pages/SocialPage.tsx`

```typescript
// Buscar missões reais
useEffect(() => {
  const fetchMissions = async () => {
    if (!company) return;
    
    const missionsQuery = query(
      collection(db, 'missions'),
      where('companyId', '==', company.id),
      where('type', '==', 'S'),
      orderBy('deadline', 'desc'),
      limit(5)
    );
    
    const snapshot = await getDocs(missionsQuery);
    const missionsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setMissions(missionsList);
  };
  
  fetchMissions();
}, [company]);

// Chart data
const chartData = useMemo(() => {
  if (!company?.evolutionData) return generateDefaultEvolutionData(company?.esgScores?.social || 0, 'S');
  
  return company.evolutionData.map(point => ({
    date: point.month,
    'Engajamento': point.social,
  }));
}, [company]);
```

---

## ⚖️ Fase 4: GovernancePage

### 4.1 Substituir chartData e Missões

**Tarefas:**

1. **Implementar busca de missões de governança**
   - Query por `type: 'G'`

2. **Substituir chartData**
   - Filtrar evolutionData por pillar 'G'

3. **Calcular governanceSubScores**

---

## 📈 Fase 5: ReportsPage

### 5.1 Dados Regionais e Comparativos

**Tarefas:**

1. **Criar collection regionalAverages**
   - Armazenar médias regionais calculadas periodicamente

2. **Implementar comparação setorial**
   - Comparar scores da empresa com médias do setor

3. **Calcular emissões de carbono**
   - Baseado nas respostas do diagnóstico (environmental_6.x)

4. **Gerar dados de tendência**
   - Mostrar evolução histórica

**Arquivo:** `src/pages/ReportsPage.tsx`

```typescript
// Buscar médias regionais
useEffect(() => {
  const fetchRegionalData = async () => {
    const regionalRef = doc(db, 'regionalAverages', company?.region || 'BR');
    const regionalDoc = await getDoc(regionalRef);
    
    if (regionalDoc.exists()) {
      setRegionalAverages(regionalDoc.data());
    }
  };
  
  if (company) fetchRegionalData();
}, [company]);
```

---

## ⚙️ Fase 6: SettingsPage

### 6.1 Implementar Funcionalidades

**Tarefas:**

1. **Persistir preferências do usuário**
   - Criar collection `userPreferences`
   - Implementar CRUD

2. **Implementar troca de tema**
   - Salvar preferência no Firestore
   - Aplicar tema via Context

3. **Implementar notificações**
   - Configurar preferências de notificação
   - Integrar com Firebase Cloud Messaging (opcional)

**Arquivo:** `src/pages/SettingsPage.tsx`

```typescript
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/useAuth';
import type { UserPreferences } from '../types';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    notifications: {
      weeklyReport: true,
      missionUpdates: true,
      scoreChanges: false,
    },
    language: 'pt-BR',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      
      const prefDoc = await getDoc(doc(db, 'userPreferences', user.uid));
      if (prefDoc.exists()) {
        setPreferences(prefDoc.data() as UserPreferences);
      }
      setLoading(false);
    };
    
    fetchPreferences();
  }, [user]);

  const handleSavePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await setDoc(doc(db, 'userPreferences', user.uid), {
        ...preferences,
        updatedAt: Timestamp.now(),
      });
      // Show success message
    } catch (err) {
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  // ... rest of component
};
```

---

## 📦 Fase 7: Componentes Compartilhados

### 7.1 EvolutionChart

**Arquivo:** `src/components/dashboard/EvolutionChart.tsx`

- Atualizar para receber dados dinâmicos
- Suportar múltiplos pilares
- Mostrar linha de comparação (setor/região)

### 7.2 RecentMissions

**Arquivo:** `src/components/dashboard/RecentMissions.tsx`

- Buscar missões dinamicamente por companyId
- Filtrar por tipo de pilar
- Implementar paginação infinita

---

## 🔄 Fase 8: Sincronização de Dados

### 8.1 Criar Cloud Functions (Opcional)

**Funções necessárias:**

```
functions/
├── calculateRegionalAverages.ts  # Calcular médias regionais diariamente
├── updateEvolutionData.ts        # Atualizar dados de evolução mensalmente
├── calculateSubScores.ts        # Calcular sub-scores após diagnóstico
└── sendWeeklyReport.ts           # Enviar relatório semanal por email
```

### 8.2 Implementar Listeners em Tempo Real

```typescript
// src/hooks/useRealtimeData.ts
export function useRealtimeData<T>(
  collectionPath: string,
  docId: string
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, collectionPath, docId),
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionPath, docId]);

  return { data, loading, error };
}
```

---

## ✅ Checklist de Implementação

### Fase 1: Infraestrutura
- [ ] Atualizar tipos em `src/types/index.ts`
- [ ] Criar hook `useCompanyData.ts`
- [ ] Criar hook `useEvolutionData.ts`
- [ ] Criar hook `useRealtimeData.ts`

### Fase 2: EnvironmentalPage
- [ ] Remover `chartData` constante
- [ ] Implementar `useMemo` para dados dinâmicos
- [ ] Buscar dados de evolução do Firestore
- [ ] Implementar fallback para dados vazios
- [ ] Calcular `environmentalSubScores`
- [ ] Persistir sub-scores no documento da empresa

### Fase 3: SocialPage
- [ ] Remover `chartData` constante
- [ ] Buscar missões da empresa do Firestore
- [ ] Implementar dados de evolução social
- [ ] Calcular `socialSubScores`

### Fase 4: GovernancePage
- [ ] Remover `chartData` constante
- [ ] Buscar missões de governança do Firestore
- [ ] Implementar dados de evolução
- [ ] Calcular `governanceSubScores`

### Fase 5: ReportsPage
- [ ] Implementar comparação regional
- [ ] Calcular emissões de carbono das respostas
- [ ] Gerar gráficos de tendência dinâmicos
- [ ] Implementar exportação de relatórios

### Fase 6: SettingsPage
- [ ] Criar collection `userPreferences`
- [ ] Implementar persistência de tema
- [ ] Implementar persistência de notificações
- [ ] Criar Context para tema global

### Fase 7: Componentes Compartilhados
- [ ] Atualizar `EvolutionChart`
- [ ] Atualizar `RecentMissions`
- [ ] Criar componente `RegionalComparison`

### Fase 8: Sincronização
- [ ] Implementar listeners em tempo real
- [ ] Criar Cloud Functions (opcional)
- [ ] Implementar sincronização offline

---

## 🧪 Testes

### Testes Unitários

- [ ] `useCompanyData` hook
- [ ] `useEvolutionData` hook
- [ ] `calculateSubScores` utility
- [ ] Funções de geração de dados

### Testes de Integração

- [ ] Fluxo completo de diagnóstico
- [ ] Persistência de preferências
- [ ] Atualização de scores
- [ ] Sincronização em tempo real

### Testes E2E

- [ ] Completar diagnóstico e verificar scores
- [ ] Alterar configurações e verificar persistência
- [ ] Visualizar relatórios com dados reais

---

## 📅 Cronograma Estimado

| Fase | Duração | Prioridade |
|------|---------|-----------|
| Fase 1: Infraestrutura | 2 dias | Alta |
| Fase 2: EnvironmentalPage | 1 dia | Alta |
| Fase 3: SocialPage | 1 dia | Alta |
| Fase 4: GovernancePage | 1 dia | Alta |
| Fase 5: ReportsPage | 2 dias | Média |
| Fase 6: SettingsPage | 1 dia | Média |
| Fase 7: Componentes | 1 dia | Média |
| Fase 8: Sincronização | 2 dias | Baixa |
| Testes | 2 dias | Alta |

**Total estimado:** 13 dias úteis

---

## 🔗 Dependências

### Bibliotecas Necessárias

```json
{
  "firebase": "^12.10.0",   // Já instalado
  "recharts": "^2.10.0"    // Para gráficos avançados (opcional)
}
```

### Migrações do Firestore

1. Adicionar collection `userPreferences`
2. Adicionar collection `evolutionHistory`
3. Adicionar collection `regionalAverages`
4. Atualizar documento `companies` com novos campos:
   - `environmentalSubScores`
   - `socialSubScores`
   - `governanceSubScores`
   - `evolutionData`

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Dados insuficientes para gráficos | Alta | Médio | Implementar fallback com dados simulados |
| Performance em queries grandes | Média | Alto | Implementar paginação e cache |
| Sincronização offline conflitante | Média | Médio | Implementar merge strategy com timestamps |
| Migração de dados existentes | Baixa | Alto | Criar script de migração com rollback |

---

## 📝 Implementação Realizada - Março 2026

### Resumo das Alterações

#### Novos Arquivos Criados:
- `src/hooks/useCompanyData.ts` - Hook para buscar dados da empresa (com opção de subscribe)
- `src/hooks/useMissions.ts` - Hooks para buscar missões filtradas por pilar (E/S/G)
- `src/hooks/useSubScores.ts` - Hooks para calcular e gerenciar sub-scores ESG
- `src/hooks/useRealtimeCompany.ts` - Hook para dados em tempo real da empresa
- `src/hooks/useRealtimeMissions.ts` - Hook para missões em tempo real
- `src/hooks/useOfflineStatus.ts` - Hook para detectar estado de conexão
- `src/hooks/index.ts` - Export centralizado de todos os hooks
- `src/services/regionalData.ts` - Serviço para cálculo de médias regionais e setoriais
- `src/services/pdfExport.ts` - Serviço para exportação de relatórios em PDF
- `functions/src/index.ts` - Cloud Functions (calculateRegionalAverages, updateEvolutionData)
- `functions/package.json` - Configuração do projeto Firebase Functions
- `functions/tsconfig.json` - Configuração TypeScript para Functions

#### Arquivos Modificados:
- `src/types/index.ts` - Novos tipos: `ESGSubScores`, `EvolutionDataPoint`, `UserPreferences`
- `src/pages/EnvironmentalPage.tsx` - Dados dinâmicos de evolução + missões reais
- `src/pages/SocialPage.tsx` - Dados dinâmicos + missões reais
- `src/pages/GovernancePage.tsx` - Dados dinâmicos + missões reais
- `src/pages/ReportsPage.tsx` - Comparações regionais/setoriais + Exportação PDF
- `src/pages/SettingsPage.tsx` - Funcionalidades completas (tema, notificações, localStorage)
- `src/pages/DashboardPage.tsx` - Atualizado para usar componentes self-fetching
- `src/components/dashboard/EvolutionChart.tsx` - Tabs de pilares + filtro de período
- `src/components/dashboard/RecentMissions.tsx` - Self-fetching + filtros + paginação
- `src/components/layout/Header.tsx` - Adicionado indicador offline
- `src/firebase.ts` - Habilitada persistência offline
- `firebase.json` - Adicionada configuração de functions

#### Funcionalidades Implementadas:
1. **EnvironmentalPage**: 
   - Gráfico de evolução dinâmico (dados do Firestore ou fallback)
   - Missões reais do Firestore (type: 'E')
   - Fallback para dados mock quando não há dados

2. **SocialPage**:
   - Gráfico de evolução social dinâmico
   - Missões sociais reais do Firestore
   - Fallback para dados mock

3. **GovernancePage**:
   - Gráfico de evolução governança dinâmico
   - Missões de governança reais do Firestore
   - Fallback para dados mock

4. **SettingsPage**:
   - Alternador de tema (Claro/Escuro/Sistema) com aplicação em tempo real
   - Controles de notificação (weekly report, mission updates, score changes)
   - Toggle de visibilidade do perfil
   - Persistência em localStorage
   - Feedback visual de sucesso ao salvar

5. **ReportsPage**:
   - Comparação regional em tempo real (média de empresas na região)
   - Ranking setorial com percentil (posição da empresa no setor)
   - Cálculo de emissões de carbono por escopo (1, 2, 3)
   - Gráfico comparativo de carbono (empresa vs média setor vs média regional)
   - Exportação de relatórios em PDF com jsPDF
   - Cards de benchmarking visual
   - Donut chart comparativo de performance

6. **EvolutionChart (Fase 7)**:
   - Tabs para alternar entre pilares: Todos, Ambiental (E), Social (S), Governança (G)
   - Modo "Todos" mostra todas as 3 linhas de evolução simultaneamente
   - Filtro de período: "Últimos 6 Meses" ou "Desde o Início"
   - Cores distintas para cada pilar (emerald, amber, blue)
   - Suporte para linha de benchmark (opcional)

7. **RecentMissions (Fase 7)**:
   - Componente self-fetching (não depende mais de props)
   - Filtros de pilar com badges de contagem (Todas, E, S, G)
   - Paginação com botão "Carregar Mais"
   - Empty state melhorado com CTA para iniciar diagnóstico
   - Loading states e tratamento de erros

8. **Real-time Sync (Fase 8)**:
   - Hooks useRealtimeCompany e useRealtimeMissions com onSnapshot
   - Atualizações automáticas quando dados mudam no Firestore
   - Indicador visual de status offline no Header
   - Persistência offline habilitada (dados disponíveis sem internet)
   - Suporte a múltiplas abas (tabManager)

9. **Cloud Functions (Fase 8)**:
   - `calculateRegionalAverages` - Calcula médias regionais de ESG (manual + agendado)
   - `updateEvolutionData` - Arquiva scores mensais na evolutionData (manual + agendado)
   - Agendamento semanal: Toda segunda-feira 9h (regional averages)
   - Agendamento mensal: Dia 1 de cada mês às 00:00 (evolution data)

#### Dados Necessários no Firestore:
Para que os dados dinâmicos funcionem corretamente, os seguintes campos devem existir no documento da empresa:
- `evolutionData`: Array de objetos com `month`, `year`, `environmental`, `social`, `governance`, `average`
- `missions`: Collection com documentos contendo `companyId`, `type` (E/S/G), `title`, `status`, `leader`, `deadline`

---

## 🚀 Deploy das Cloud Functions

Para fazer deploy das Cloud Functions, execute os seguintes comandos:

```bash
# Navegar para o diretório do projeto
cd stitch-esg-dashboard

# Instalar dependências das functions
cd functions && npm install && cd ..

# Fazer deploy de todas as functions
firebase deploy --only functions

# Ou deploy individual
firebase deploy --only functions:calculateRegionalAverages
firebase deploy --only functions:updateEvolutionData
```

### Pré-requisitos:
1. Firebase CLI instalado: `npm install -g firebase-tools`
2. Login no Firebase: `firebase login`
3. Projeto selecionado: `firebase use --add`
4. Plano Blaze (pay-as-you-go) ativado no Firebase Console

### Funções Disponíveis:

**Manuais (HTTP Callable):**
- `calculateRegionalAverages` - Calcula médias regionais sob demanda
- `updateEvolutionData` - Atualiza dados de evolução sob demanda

**Agendadas (Pub/Sub):**
- `scheduledCalculateRegionalAverages` - Toda segunda 9h
- `scheduledUpdateEvolutionData` - Dia 1 de cada mês às 00:00

---

**Última atualização:** Março 2026  
**Status:** ✅ Todas as Fases concluídas (1-8)  
**Build:** ✅ Passando
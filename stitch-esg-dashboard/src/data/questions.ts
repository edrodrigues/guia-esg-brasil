export interface QuestionOption {
  label: string;
  value: number; // 0 to 100
}

export interface Question {
  id: string;
  category: 'environmental' | 'social' | 'governance';
  text: string;
  description?: string;
  options: QuestionOption[];
}

export const diagnosticQuestions: Question[] = [
  // --- ENVIRONMENTAL ---
  {
    id: 'e1',
    category: 'environmental',
    text: 'Como sua empresa monitora as emissões de gases de efeito estufa (GEE)?',
    options: [
      { label: 'Não monitoramos.', value: 0 },
      { label: 'Monitoramos apenas o consumo de energia elétrica.', value: 40 },
      { label: 'Realizamos inventário parcial (Escopo 1 e 2).', value: 70 },
      { label: 'Inventário completo (Escopos 1, 2 e 3) com metas de redução.', value: 100 },
    ]
  },
  {
    id: 'e2',
    category: 'environmental',
    text: 'Qual a política de gestão de resíduos da organização?',
    options: [
      { label: 'Descarte comum, sem separação.', value: 0 },
      { label: 'Separação básica (reciclável vs orgânico).', value: 30 },
      { label: 'Coleta seletiva rigorosa e destinação certificada.', value: 70 },
      { label: 'Aterro zero e economia circular implementada.', value: 100 },
    ]
  },
  {
    id: 'e3',
    category: 'environmental',
    text: 'A empresa utiliza fontes de energia renovável?',
    options: [
      { label: '100% da rede convencional.', value: 10 },
      { label: 'Possuímos algumas iniciativas pontuais.', value: 40 },
      { label: 'Parte significativa (>50%) vem de fontes renováveis.', value: 80 },
      { label: '100% da energia é renovável/autoprodução.', value: 100 },
    ]
  },

  // --- SOCIAL ---
  {
    id: 's1',
    category: 'social',
    text: 'Como é a composição de diversidade na liderança?',
    options: [
      { label: 'Homogênea, sem políticas de diversidade.', value: 10 },
      { label: 'Temos políticas, mas a liderança ainda é pouco diversa.', value: 40 },
      { label: 'Liderança com representatividade de gênero ou raça.', value: 70 },
      { label: 'Liderança reflete a demografia da sociedade em múltiplos pilares.', value: 100 },
    ]
  },
  {
    id: 's2',
    category: 'social',
    text: 'Qual o nível de engajamento com a comunidade local?',
    options: [
      { label: 'Nenhuma ação estruturada.', value: 0 },
      { label: 'Doações pontuais.', value: 30 },
      { label: 'Projetos sociais recorrentes.', value: 70 },
      { label: 'Programas de impacto mensurado e voluntariado corporativo.', value: 100 },
    ]
  },
  {
    id: 's3',
    category: 'social',
    text: 'A empresa oferece benefícios além do obrigatório por lei?',
    options: [
      { label: 'Apenas o legal (VT/VR).', value: 20 },
      { label: 'Plano de saúde e odontológico.', value: 50 },
      { label: 'Pacote robusto (Saúde, Bem-estar, Educação).', value: 80 },
      { label: 'Benefícios flexíveis, apoio psicológico e licenças estendidas.', value: 100 },
    ]
  },

  // --- GOVERNANCE ---
  {
    id: 'g1',
    category: 'governance',
    text: 'A empresa possui um Código de Ética e Conduta?',
    options: [
      { label: 'Não possui.', value: 0 },
      { label: 'Possui, mas é pouco divulgado.', value: 40 },
      { label: 'Possui, é divulgado e todos assinam.', value: 70 },
      { label: 'Possui, com treinamentos periódicos e canal de denúncia anônimo.', value: 100 },
    ]
  },
  {
    id: 'g2',
    category: 'governance',
    text: 'Como é a estrutura de tomada de decisão?',
    options: [
      { label: 'Centralizada totalmente nos sócios/donos.', value: 20 },
      { label: 'Possui reuniões de diretoria informais.', value: 40 },
      { label: 'Conselho Consultivo implantado.', value: 80 },
      { label: 'Conselho de Administração independente e auditado.', value: 100 },
    ]
  },
  {
    id: 'g3',
    category: 'governance',
    text: 'Qual o nível de transparência financeira?',
    options: [
      { label: 'Controle interno básico.', value: 20 },
      { label: 'Fechamentos anuais contábeis.', value: 50 },
      { label: 'Auditoria externa periódica.', value: 80 },
      { label: 'Publicação de balanços auditados e relatórios de sustentabilidade (GRI).', value: 100 },
    ]
  }
];

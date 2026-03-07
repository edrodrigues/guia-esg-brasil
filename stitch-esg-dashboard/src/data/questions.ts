import { Question } from '../types';

export const diagnosticQuestions: Question[] = [
  {
    "id": "form_1.1",
    "category": "form",
    "subcategory": "IDENTIFICAÇÃO",
    "text": "Nome da Empresa",
    "inputType": "text",
    "options": []
  },
  {
    "id": "form_1.2",
    "category": "form",
    "subcategory": "IDENTIFICAÇÃO",
    "text": "CNPJ",
    "inputType": "number",
    "options": []
  },
  {
    "id": "form_1.3",
    "category": "form",
    "subcategory": "ESCOPO",
    "text": "Escopo da avaliação",
    "inputType": "date",
    "options": []
  },
  {
    "id": "form_1.4",
    "category": "form",
    "subcategory": "CATEGORIA",
    "text": "Setor",
    "inputType": "radio",
    "options": [
      {
        "label": "Atacado/varejo",
        "value": "Atacado/varejo",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Fabricação",
        "value": "Fabricação",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Serviço",
        "value": 1,
        "points": 1,
        "weight": 1
      }
    ]
  },
  {
    "id": "form_1.5",
    "category": "form",
    "subcategory": "CATEGORIA",
    "text": "Tipo de Produto/Serviço",
    "inputType": "radio",
    "options": [
      {
        "label": "Móveis em madeira",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Móveis Planejados",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Estofados",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Móveis de metal",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Outros.",
        "value": 1,
        "points": 1,
        "weight": 1
      }
    ]
  },
  {
    "id": "form_1.6",
    "category": "form",
    "subcategory": "CATEGORIA",
    "text": "ATIVIDADE",
    "inputType": "radio",
    "options": [
      {
        "label": "Design e fabricação",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Venda e distribuição",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "E-commerce",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Outros.",
        "value": 1,
        "points": 1,
        "weight": 1
      }
    ]
  },
  {
    "id": "form_1.6 a",
    "category": "form",
    "subcategory": "CATEGORIA",
    "text": "Sobre a segurança dos dados em seu ambiente digital.",
    "inputType": "radio",
    "options": [
      {
        "label": "Não temos qualquer solução de segurança de dados.",
        "value": "Não temos qualquer solução de segurança de dados.",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Description of policies and practices relating to targeted advertising and user privacy",
        "value": "Description of policies and practices relating to targeted advertising and user privacy",
        "points": 0,
        "weight": 1
      },
      {
        "label": "LGPD",
        "value": "LGPD",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "form_1.6 b",
    "category": "form",
    "subcategory": "CATEGORIA",
    "text": "Embalagem.",
    "inputType": "radio",
    "options": []
  },
  {
    "id": "form_1.6 c",
    "category": "form",
    "subcategory": "CATEGORIA",
    "text": "Distribuição.",
    "inputType": "radio",
    "options": []
  },
  {
    "id": "form_1.7",
    "category": "form",
    "subcategory": "CATEGORIA",
    "text": "NÚMERO DE FUNCIONÁRIOS",
    "inputType": "radio",
    "options": [
      {
        "label": "0 - 10 funcionários",
        "value": 1,
        "points": 1,
        "weight": 1,
        "message": "Conhecer o porte da empresa é importante pois auxilia a mapear suas responsabilidades e compromissos com a comunidade."
      },
      {
        "label": "10 - 50 funcionários",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "50 - 100 funcionários",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "100 - 200 funcionários",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "acima de 200 funcionários",
        "value": 1,
        "points": 1,
        "weight": 1
      }
    ]
  },
  {
    "id": "form_1.8",
    "category": "form",
    "subcategory": "SEDE E FILIAIS",
    "text": "CIDADE",
    "inputType": "select",
    "options": [
      {
        "label": "[caixa de rolagem]",
        "value": "[caixa de rolagem]",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "form_1.9",
    "category": "form",
    "subcategory": "SEDE E FILIAIS",
    "text": "ESTADO",
    "inputType": "select",
    "options": [
      {
        "label": "[caixa de rolagem]",
        "value": "[caixa de rolagem]",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "form_1.10",
    "category": "form",
    "subcategory": "DADOS DEMOGRÁFICOS DE PROPRIEDADE",
    "text": "A empresa pertence a:",
    "inputType": "radio",
    "options": [
      {
        "label": "Propriedade familiar",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Pertence a mulheres",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Pertence a pessoa LGBTQIAPN+",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Pertence a pessoa negra ou indígena",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Pessoa com deficiência",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_2.1",
    "category": "environmental",
    "subcategory": "2. SGA",
    "text": "A sua empresa monitora e reporta indicadores ambientais?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 0.5,
        "recommendation": "Organize um Sistema de Gestão Ambiental segundo a Norma ISO 14.001/2005 em sua empresa. \n\nUm sistema de gestão ambiental (SGA) é um conjunto de políticas, procedimentos e práticas adotadas por uma organização para gerenciar e minimizar seu impacto ambiental. Ele visa promover a sustentabilidade ao integrar considerações ambientais nas operações diárias da empresa. \n\nUm SGA geralmente inclui atividades como identificação e avaliação de impactos ambientais, estabelecimento de metas e objetivos ambientais, implementação de medidas de controle e monitoramento do desempenho ambiental. O objetivo final é reduzir a pegada ecológica da organização e promover práticas empresariais responsáveis em relação ao meio ambiente."
      },
      {
        "label": "Monitoramos alguns indicadores ambientais.",
        "value": 2,
        "points": 2,
        "weight": 0.5,
        "recommendation": "Organize um Sistema de Gestão Ambiental segundo a Norma ISO 14.001/2005 em sua empresa. \n\nUm sistema de gestão ambiental (SGA) é um conjunto de políticas, procedimentos e práticas adotadas por uma organização para gerenciar e minimizar seu impacto ambiental. Ele visa promover a sustentabilidade ao integrar considerações ambientais nas operações diárias da empresa. \n\nUm SGA geralmente inclui atividades como identificação e avaliação de impactos ambientais, estabelecimento de metas e objetivos ambientais, implementação de medidas de controle e monitoramento do desempenho ambiental. O objetivo final é reduzir a pegada ecológica da organização e promover práticas empresariais responsáveis em relação ao meio ambiente."
      },
      {
        "label": "A empresa monitora seus indicadores ambientais e os reporta internamente.",
        "value": 3,
        "points": 3,
        "weight": 1,
        "recommendation": "Organize um Sistema de Gestão Ambiental segundo a Norma ISO 14.001/2005 em sua empresa. \n\nUm sistema de gestão ambiental (SGA) é um conjunto de políticas, procedimentos e práticas adotadas por uma organização para gerenciar e minimizar seu impacto ambiental. Ele visa promover a sustentabilidade ao integrar considerações ambientais nas operações diárias da empresa. \n\nUm SGA geralmente inclui atividades como identificação e avaliação de impactos ambientais, estabelecimento de metas e objetivos ambientais, implementação de medidas de controle e monitoramento do desempenho ambiental. O objetivo final é reduzir a pegada ecológica da organização e promover práticas empresariais responsáveis em relação ao meio ambiente."
      },
      {
        "label": "A empresa monitora e possui metas estabelecidas para melhorar seu desempenho.",
        "value": 4,
        "points": 4,
        "weight": 2,
        "recommendation": "Organize um Sistema de Gestão Ambiental segundo a Norma ISO 14.001/2005 em sua empresa. \n\nUm sistema de gestão ambiental (SGA) é um conjunto de políticas, procedimentos e práticas adotadas por uma organização para gerenciar e minimizar seu impacto ambiental. Ele visa promover a sustentabilidade ao integrar considerações ambientais nas operações diárias da empresa. \n\nUm SGA geralmente inclui atividades como identificação e avaliação de impactos ambientais, estabelecimento de metas e objetivos ambientais, implementação de medidas de controle e monitoramento do desempenho ambiental. O objetivo final é reduzir a pegada ecológica da organização e promover práticas empresariais responsáveis em relação ao meio ambiente."
      },
      {
        "label": "A empresa monitora seus indicadores ambientais, possui um Sistema de Gestão Ambiental e já alcançou metas relevantes nesse setor.",
        "value": 5,
        "points": 5,
        "weight": 2
      }
    ]
  },
  {
    "id": "environmental_2.2",
    "category": "environmental",
    "subcategory": "2. SGA",
    "text": "Existe algum documento que aborde o posicionamento socioambiental ou a política ambiental da empresa?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 2,
        "points": 2,
        "weight": 1,
        "message": "A missão socioambiental da empresa é um documento importante que deve estar divulgado em todos os materiais públicos da empresa."
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1,
        "message": "A missão socioambiental da empresa é um documento importante que deve estar divulgado em todos os materiais públicos da empresa."
      }
    ]
  },
  {
    "id": "environmental_2.3",
    "category": "environmental",
    "subcategory": "2. SGA",
    "text": "Descreva aqui o posicionamento socioambiental da empresa.",
    "inputType": "text",
    "options": [
      {
        "label": "[TEXTO CURTO]",
        "value": "[TEXTO CURTO]",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_3.1",
    "category": "environmental",
    "subcategory": "3. ENERGIA",
    "text": "Como a sua empresa monitora o consumo de energia?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 0.5,
        "message": "A indústria moveleira utiliza energia em várias etapas do processo de produção, desde a extração de matéria-prima até a fabricação, transporte e montagem dos móveis. Por isso, a energia é um dos impactos mais significativos."
      },
      {
        "label": "Monitoramos, mas não estabelecemos metas de redução.",
        "value": 2,
        "points": 2,
        "weight": 0.5
      },
      {
        "label": "A empresa monitora e tem reduzido o seu consumo.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Alcançamos as metas de redução no consumo no último ano fiscal.",
        "value": 4,
        "points": 4,
        "weight": 2
      },
      {
        "label": "A empresa possui tecnologias verdes implementadas para diversificar suas fontes de fornecimento de energia.",
        "value": 5,
        "points": 5,
        "weight": 2
      }
    ]
  },
  {
    "id": "environmental_3.2",
    "category": "environmental",
    "subcategory": "3. ENERGIA",
    "text": "Consumo de energia no último ano fiscal?",
    "inputType": "number",
    "options": [
      {
        "label": "Kw",
        "value": "Kw",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_3.3",
    "category": "environmental",
    "subcategory": "3. ENERGIA",
    "text": "Fontes de fornecimento de energia",
    "inputType": "radio",
    "options": [
      {
        "label": "Fornecimento regular e geradores movidos à diesel eventualmente.",
        "value": 1,
        "points": 1,
        "weight": 0.5,
        "message": "A energia é o impacto um dos impactos mais significativos para a indústria moveleira, por isso, adotar fontes renováveis e responsáveis é um dos pontos mais importantes desta avaliação."
      },
      {
        "label": "Fornecimento regular",
        "value": 2,
        "points": 2,
        "weight": 0.5
      },
      {
        "label": "Fornecimento regular e outras fontes ecoeficientes como energia solar.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Energia adquirida no mercado livre",
        "value": 4,
        "points": 4,
        "weight": 2
      },
      {
        "label": "A empresa passou por uma transição energética, possui metas de redução ou transição para fontes ecoeficientes e geração própria de energia por biodigestão ou outras tecnologias verdes.",
        "value": 5,
        "points": 5,
        "weight": 2
      }
    ]
  },
  {
    "id": "environmental_3.4",
    "category": "environmental",
    "subcategory": "3. ENERGIA",
    "text": "Qual o percentual do fornecimento de energia é proveniente de fontes sustentáveis e ecoeficientes?",
    "inputType": "radio",
    "options": [
      {
        "label": "Menos de 10%",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "10%",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "15%",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "20%",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "+ de 50%",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_4.1",
    "category": "environmental",
    "subcategory": "4. ÁGUA E EFLUENTES",
    "text": "Como a sua empresa monitora o consumo de água?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos ainda.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Monitoramos, mas não estabelecemos metas de redução.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "A empresa monitora e tem reduzido o seu consumo.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Alcançamos as metas de redução no último ano fiscal.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "A empresa passou por uma transição e mais de 50% do consumo atual de água é proveniente de fontes ecoeficientes.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_4.2",
    "category": "environmental",
    "subcategory": "4. ÁGUA E EFLUENTES",
    "text": "Consumo de água no último ano fiscal?",
    "inputType": "radio",
    "options": [
      {
        "label": "Lts",
        "value": "Lts",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_4.3",
    "category": "environmental",
    "subcategory": "4. ÁGUA E EFLUENTES",
    "text": "Fontes de fornecimento de água",
    "inputType": "radio",
    "options": [
      {
        "label": "Captação em corpos hídricos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Poço artesiano ou caminhão-pipa.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Fornecimento regular.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Reutilização de água de chuva.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Autossuficiência em água através de fontes responsáveis de aproveitamento e reaproveitamento de águas tratadas pela empresa.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_4.4",
    "category": "environmental",
    "subcategory": "4. ÁGUA E EFLUENTES",
    "text": "Qual o percentual do fornecimento de energia é proveniente de fontes sustentáveis e ecoeficientes?",
    "inputType": "radio",
    "options": [
      {
        "label": "Menos de 10%",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "10%",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "15%",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "20%",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "50% ou mais",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_4.5",
    "category": "environmental",
    "subcategory": "4. ÁGUA E EFLUENTES",
    "text": "De que forma a empresa descarta seus efluentes?",
    "inputType": "radio",
    "options": [
      {
        "label": "In natura em corpos hídricos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Tratamento feito pela empresa e despejado em corpos hídricos.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "In natura para o esgoto regular.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "A empresa possui Estação de Tratamento de Efluentes que após tratados são enviados para o esgoto regular",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "A empresa possui em suas instalações tecnologias de tratamento e reaproveitamento de água de esgoto.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_4.6",
    "category": "environmental",
    "subcategory": "4. ÁGUA E EFLUENTES",
    "text": "A empresa emite efluentes tóxicos?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 5,
        "points": 5,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": "Sim",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_4.7",
    "category": "environmental",
    "subcategory": "4. ÁGUA E EFLUENTES",
    "text": "De que forma a empresa monitora o tratamento e descarte dos efluentes tóxicos?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não adotamos nenhuma medida.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "A empresa monitora sua toxicidade e volume.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "A empresa monitora sua toxicidade, volume e possui uma Estação de Tratamento de Efluentes.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "A empresa monitora sua toxicidade, volume, possui uma Estação de Tratamento de Efluentes e estabeleceu metas de redução do volume do material residual tóxico.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "A empresa conseguiu reduzir em mais de 50% ou zerar a emissão de efluentes tóxicos.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_5.1",
    "category": "environmental",
    "subcategory": "5. GESTAO DE RESIDUOS",
    "text": "A empresa possui um plano de gerenciamento de resíduos?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": "Não",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_5.2",
    "category": "environmental",
    "subcategory": "5. GESTAO DE RESIDUOS",
    "text": "Qual o volume de resíduos gerados no último ano fiscal?",
    "inputType": "number",
    "options": [
      {
        "label": "[NÚMERO TOTAL] Kg\n\n[NÚMERO RECICLÁVEIS] Kg",
        "value": "[NÚMERO TOTAL] Kg\n\n[NÚMERO RECICLÁVEIS] Kg",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_5.3",
    "category": "environmental",
    "subcategory": "5. GESTAO DE RESIDUOS",
    "text": "Qual o destino final dos resíduos gerados pela empresa?",
    "inputType": "radio",
    "options": [
      {
        "label": "Coleta regular.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Coleta regular e cooperativa de materiais recicláveis.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Reaproveitamento no processo produtivo, coleta regular e cooperativa de materiais recicláveis.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Temos uma empresa contratada para fazer a destinação final correta.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Conseguimos reduzir em mais de 50% o volume dos resíduos gerados ou somos uma empresa que possui o compromisso de produzir lixo zero.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_5.4",
    "category": "environmental",
    "subcategory": "5. GESTAO DE RESIDUOS",
    "text": "Quais as medidas relacionadas à redução de resíduos são adotadas pela sua empresa?",
    "inputType": "radio",
    "options": [
      {
        "label": "Fazemos a coleta seletiva do lixo.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Fazemos a coleta seletiva do lixo e nos comprometemos com o treinamento de toda a equipe e a sensibilização acerca do tema resíduos e o desperdício de materiais.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Fazemos a coleta seletiva, destinamos de forma correta e adotamos medidas práticas para a redução da produção de lixo em nossos processos.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Temos parcerias com instituições que reaproveitam os materiais recicláveis descartados, como cooperativas de catadores.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Reaproveitamos nossos resíduos como matéria-prima para produzir novos produtos.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_5.5",
    "category": "environmental",
    "subcategory": "5. GESTAO DE RESIDUOS",
    "text": "A empresa monitora o volume de resíduos perigosos gerados?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": "Não",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_5.6",
    "category": "environmental",
    "subcategory": "5. GESTAO DE RESIDUOS",
    "text": "Existe alguma medida ou tecnologia aplicada às embalagens para evitar a proliferação de materiais plásticos?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": "Não",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_6.1",
    "category": "environmental",
    "subcategory": "6. AR E CLIMA",
    "text": "De que forma a sua empresa monitora as emissões de Gases de Efeito Estufa?",
    "inputType": "radio",
    "options": [
      {
        "label": "Atualmente não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Monitoramos de forma parcial.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Monitoramos através de um Inventário verificação de GEE.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Monitoramos e estabelecemos metas de redução.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Monitoramos e estabelecemos meta de carbono zero.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_6.2",
    "category": "environmental",
    "subcategory": "6. AR E CLIMA",
    "text": "Qual a emissão em CO2 durante o último ano fiscal?",
    "inputType": "number",
    "options": [
      {
        "label": "Total do ESCOPO 1",
        "value": "Total do ESCOPO 1",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Total do ESCOPO 2",
        "value": "Total do ESCOPO 2",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Total do ESCOPO 3",
        "value": "Total do ESCOPO 3",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_6.3",
    "category": "environmental",
    "subcategory": "6. AR E CLIMA",
    "text": "De que forma a sua empresa monitora qualidade do ar nas suas instalações?",
    "inputType": "radio",
    "options": [
      {
        "label": "Atualmente não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Não monitoramos, mas possuímos ambientes abertos e ventilados.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Monitoramos periodicamente e possuímos aparelhos de filtragem de ar.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Monitoramos periodicamente, possuímos aparelhos de filtragem de ar e estabelecemos metas de melhoria.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Monitoramos periodicamente, possuímos aparelhos de filtragem de ar e alcançamos nossas metas de melhoria.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_7.1",
    "category": "environmental",
    "subcategory": "7. MATÉRIA-PRIMA",
    "text": "A empresa possui alguma certificação de rastreabilidade?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos a origem de nossas matérias-prima.",
        "value": 1,
        "points": 1,
        "weight": 0.5
      },
      {
        "label": "Nossa matéria-prima é verificada, mas não é certificada.",
        "value": 2,
        "points": 2,
        "weight": 0.5
      },
      {
        "label": "Utilizamos mais de 50% de matéria-prima certificada.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Utilizamos apenas matéria-prima certificada.",
        "value": 4,
        "points": 4,
        "weight": 2
      },
      {
        "label": "A empresa é certificada pela FSC ou por outras certificação de manejo florestal responsável.",
        "value": 5,
        "points": 5,
        "weight": 2
      }
    ]
  },
  {
    "id": "environmental_7.2",
    "category": "environmental",
    "subcategory": "7. MATÉRIA-PRIMA",
    "text": "Na empresa existem iniciativas para fortalecer o manejo sustentável dos fornecedores de madeira?",
    "inputType": "radio",
    "options": [
      {
        "label": "A empresa não possui iniciativas de fortalecimento de manejo estabelecidas e implantadas.",
        "value": 1,
        "points": 1,
        "weight": 0.5
      },
      {
        "label": "A empresa planeja adotar iniciativas para fortalecer o manejo sustentável pelos fornecedores de madeira.",
        "value": 2,
        "points": 2,
        "weight": 0.5
      },
      {
        "label": "Existem iniciativas de fortalecimento do manejo florestal estabelecidas e implantadas.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "As  iniciativas de fortalecimento de manejo  florestal estão estabelecidas e em implantação.",
        "value": 4,
        "points": 4,
        "weight": 2
      },
      {
        "label": "Temos um programa de manejo sustentável com os fornecedores e também buscamos regenerar florestas como forma de compensar nossos impactos negativos.",
        "value": 5,
        "points": 5,
        "weight": 2
      }
    ]
  },
  {
    "id": "environmental_8.1",
    "category": "environmental",
    "subcategory": "8. DESIGN CIRCULAR E CICLO DE VIDA",
    "text": "A empresa possui a gestão do ciclo de vida do produto?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não possuímos a gestão do ciclo de vida.",
        "value": 1,
        "points": 1,
        "weight": 0.5
      },
      {
        "label": "Conhecemos o ciclo de vida do nosso produto, mas não nos responsabilizamos pela sua destinação final.",
        "value": 2,
        "points": 2,
        "weight": 0.5
      },
      {
        "label": "Conhecemos o ciclo de vida do nosso produto e fazemos as recomendações na embalagem sobre o descarte adequado.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Possuímos sistema de logística reversa.",
        "value": 4,
        "points": 4,
        "weight": 2
      },
      {
        "label": "A empresa é certificada pela CRADLE TO CRADLE ou por outras certificação de controle de ciclo de vida de produto.",
        "value": 5,
        "points": 5,
        "weight": 2
      }
    ]
  },
  {
    "id": "environmental_8.2",
    "category": "environmental",
    "subcategory": "8. DESIGN CIRCULAR E CICLO DE VIDA",
    "text": "A empresa possui em seus processos produtivos a adoção do design voltado à segurança de seus produtos durante todo o ciclo de vida?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": "Não",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_8.3",
    "category": "environmental",
    "subcategory": "8. DESIGN CIRCULAR E CICLO DE VIDA",
    "text": "A empresa possui em seus processos produtivos a adoção do design voltado à circularidade e à redução de resíduos provenientes de seus produtos?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": "Não",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "environmental_8.4",
    "category": "environmental",
    "subcategory": "8. DESIGN CIRCULAR E CICLO DE VIDA",
    "text": "Qual o posicionamento da empresa relativo à produtos tóxicos?",
    "inputType": "radio",
    "options": [
      {
        "label": "Utilizamos produtos tóxicos e ainda não conseguimos pensar em alternativas para reduzir a toxicidade do nosso processo produtivo.",
        "value": 1,
        "points": 1,
        "weight": 0.5
      },
      {
        "label": "Utilizamos produtos tóxicos e buscamos reduzir o seu uso.",
        "value": 2,
        "points": 2,
        "weight": 0.5
      },
      {
        "label": "Utilizamos apenas o necessário de produtos tóxicos e já conseguimos pensar em alternativas para reduzir a toxicidade do nosso processo produtivo.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Já possuímos alternativas implementadas e mais de 50% da nossa produção não utiliza produtos tóxicos.",
        "value": 4,
        "points": 4,
        "weight": 2
      },
      {
        "label": "Não utilizamos produtos tóxicos em nosso processo produtivo.",
        "value": 5,
        "points": 5,
        "weight": 2
      }
    ]
  },
  {
    "id": "environmental_8.5",
    "category": "environmental",
    "subcategory": "8. DESIGN CIRCULAR E CICLO DE VIDA",
    "text": "Sua empresa adotou alguma tecnologia para minimizar o impacto ambiental relacionado ao transporte em sua cadeia de abastecimento e distribuição?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": "Não",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      },
      {
        "label": "perguntas",
        "value": "perguntas",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_9.1",
    "category": "social",
    "subcategory": "9. DIREITOS HUMANOS",
    "text": "A empresa possui política ou compliance para evitar a ocorrência de violações de direitos humanos em sua cadeia de valor?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não possuímos o compromisso formal com os direitos humanos.",
        "value": 1,
        "points": 1,
        "weight": 0.5,
        "message": "Os impactos relativos à violação de direitos humanos são o maior risco reputacional para uma empresa, na prática estamos falando de medidas como prevenção ao trabalho análogo à escravidão e ao trabalho infantil. As medidas positivas podem ser a contratação de imigrantes ou o apoio à alguma organização que o faça."
      },
      {
        "label": "Possuímos em nossos documentos (compliance ou outros) a expressa menção ou mecanismos para evitar violações de direitos humanos.",
        "value": 2,
        "points": 2,
        "weight": 0.5
      },
      {
        "label": "Possuímos o compromisso com os direitos humanos em toda a nossa cadeia de valor, adotamos práticas responsáveis e exigimos o mesmo dos fornecedores.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Fazemos verificações periódicas sobre os riscos associados aos direitos humanos em nossa cadeia de valor.",
        "value": 4,
        "points": 4,
        "weight": 2
      },
      {
        "label": "Possuimos elevados níveis de colaboração com a agenda dos direitos humanos, adotamos políticas práticas internas e colaborações de nivel global.",
        "value": 5,
        "points": 5,
        "weight": 2
      }
    ]
  },
  {
    "id": "social_9.2",
    "category": "social",
    "subcategory": "9. DIREITOS HUMANOS",
    "text": "A empresa monitora os riscos socioambientais associados aos seus produtos na cadeia de valor?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não consideramos os riscos socioambientais em nossa cadeia de valor.",
        "value": 1,
        "points": 1,
        "weight": 0.5,
        "message": "Os impactos relativos à violação de direitos humanos são o maior risco reputacional para uma empresa, na prática estamos falando de medidas como prevenção ao trabalho análogo à escravidão e ao trabalho infantil. As medidas positivas podem ser a contratação de imigrantes ou o apoio à alguma organização que o faça."
      },
      {
        "label": "Temos um mapeamento de riscos, mas não fiscalizamos.",
        "value": 2,
        "points": 2,
        "weight": 0.5
      },
      {
        "label": "Temos um mapeamento de riscos e frequentemente fiscalizamos nossos fornecedores e empresas contratadas.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Exigimos que os nossos fornecedores e contratadas reportem suas práticas de prevenção à violação de direitos humanos.",
        "value": 4,
        "points": 4,
        "weight": 2
      },
      {
        "label": "Temos normas formais acerca da gestão dos riscos socioambientais em nossa cadeia de valor",
        "value": 5,
        "points": 5,
        "weight": 2
      }
    ]
  },
  {
    "id": "social_9.3",
    "category": "social",
    "subcategory": "9. DIREITOS HUMANOS",
    "text": "A empresa possui política de contratação de imigrantes ou de pessoas em situação de vulnerabilidade social?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_10.1",
    "category": "social",
    "subcategory": "10. PRÁTICAS TRABALHISTAS",
    "text": "A empresa possui um manual do funcionário formalizado por escrito?",
    "inputType": "radio",
    "options": [
      {
        "label": "A empresa não tem um manual do funcionário formalizado por escrito.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Apenas uma declaração de não discriminação e informações gerais sobre os horários de trabalho",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Uma política contra o assédio com mecanismos de denúncia e processos e procedimentos disciplinares, medidas disciplinares e possíveis sanções",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "O manual do funcionário aborda além das questões anteriores políticas sobre questões de remuneração e desempenho, capacitação e licenças",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "O manual do funcionário é construido com a participação das partes interessadas, possui uma declaração de neutralidade sobre o direito dos trabalhadores à negociação coletiva e à liberdade de associação, além de regras sobre direitos humanos como a proibição do trabalho infantil e do trabalho forçado ou compulsório",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_10.2",
    "category": "social",
    "subcategory": "10. PRÁTICAS TRABALHISTAS",
    "text": "Qual o percentual de trabalhadores são terceirizados?",
    "inputType": "radio",
    "options": [
      {
        "label": "Mais de 70% da força de trabalho.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Mais de 50% da força de trabalho.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Menos de 50% da força de trabalho.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Menos de 20% da força de trabalho.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Não contratamos trabalhadores terceirizados.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_10.3",
    "category": "social",
    "subcategory": "10. PRÁTICAS TRABALHISTAS",
    "text": "Número de trabalhadores temporários no último ano fiscal?",
    "inputType": "radio",
    "options": [
      {
        "label": "Mais de 70%",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Mais de 50%",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Menos de 50%",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Menos de 20%",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Não contratam trabalhadores temporários.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_10.4",
    "category": "social",
    "subcategory": "10. PRÁTICAS TRABALHISTAS",
    "text": "A empresa oferece benefícios para aumentar a renda dos trabalhadores como a participação nos lucros e resultados ou acréscimo por produtividade.",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 5,
        "points": 5,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": "Sim",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_11.1",
    "category": "social",
    "subcategory": "11. SAÚDE E SEGURANÇA",
    "text": "Quais os benefícios que a empresa oferece para complementar os benefícios governamentais?",
    "inputType": "radio",
    "options": [
      {
        "label": "Cobertura por invalidez ou seguro contra acidentes.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Seguro de vida.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Seguro odontológico privado",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Seguro de saúde privado.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Seguro de saúde privado complementar com extensão dos benefícios de saúde ao cônjuge e aos filhos",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_11.2",
    "category": "social",
    "subcategory": "11. SAÚDE E SEGURANÇA",
    "text": "São feitas capacitações periódicas sobre o programa de saúde e segurança?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não há um programa formal de saúde e segurança",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Fazemos capacitações em saúde e segurança para todos os trabalhadores, que inclua pelo menos uma simulação de emergência por ano.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Registramos e divulgamos os dados sobre lesões, acidentes, dias perdidos ou dias de ausência para todos os trabalhadores",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Possuímos um sistema formal de denúncia de questões de segurança para que os funcionários possam apresentar suas preocupações relacionadas à segurança",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Existe uma comissão ou um funcionário responsável pela segurança ou um representante do programa de segurança que responda a um funcionário sênior (por exemplo, vice-presidente ou superior)",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_11.3",
    "category": "social",
    "subcategory": "11. SAÚDE E SEGURANÇA",
    "text": "Qual a política da empresa em relação à manipulação de substâncias ou equipamentos perigosos?",
    "inputType": "radio",
    "options": [
      {
        "label": "Todos os trabalhadores são informados dos riscos associados ao manuseio de materiais perigosos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "A empresa exige que todos os trabalhadores que estão em contato com materiais perigosos usem equipamentos de proteção, incluindo roupas adequadas e proteção para os olhos e os pés.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Todos os trabalhadores que estão em contato com materiais perigosos recebem capacitação inicial e continuada (pelo menos duas vezes por ano) relacionada ao armazenamento, manuseio e descarte adequados dos materiais.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "A empresa monitora a saúde de todos os funcionários que trabalham com materiais perigosos e fornece a eles check-ups de saúde anuais.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "A empresa realiza o monitoramento da saúde dos funcionários que trabalham em contato com materiais perigosos, fornecendo todas as instruções e materiais necessários para que não haja nenhum dano.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_11.4",
    "category": "social",
    "subcategory": "11. SAÚDE E SEGURANÇA",
    "text": "A empresa monitora a incidência de acidentes graves e fatais no ambiente de trabalho?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Monitoramos e fazemos o acompanhamento preventivo.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Possuímos um forte sistema de prevenção à acidentes de trabalho, além da CIPA.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Buscamos monitorar e prevenir os danos, assim como a empresa fez investimentos em equipamentos mais seguros.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Temos os orgulho de reportar que não houveram acidentes no último ano fiscal.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_12.1",
    "category": "social",
    "subcategory": "12. ENGAJAMENTO E DIVERSIDADE",
    "text": "Qual o percentual dos seus trabalhadores são mulheres?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Até 10%",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Entre 10% e 15%",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Entre 15% e 25%",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "50% ou mais",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_12.2",
    "category": "social",
    "subcategory": "12. ENGAJAMENTO E DIVERSIDADE",
    "text": "Qual o percentual dos seus trabalhadores são pessoas negras?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Até 10%",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Entre 10% e 15%",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Entre 15% e 25%",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "50% ou mais",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_12.3",
    "category": "social",
    "subcategory": "12. ENGAJAMENTO E DIVERSIDADE",
    "text": "Qual o percentual dos seus trabalhadores são LGBTQIAPN+?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Até 10%",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Entre 10% e 15%",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Entre 15% e 25%",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "50% ou mais",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_12.4",
    "category": "social",
    "subcategory": "12. ENGAJAMENTO E DIVERSIDADE",
    "text": "Qual o percentual dos seus trabalhadores possuem mais de 55 anos?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Até 10%",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Entre 10% e 15%",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Entre 15% e 25%",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "50% ou mais",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_12.5",
    "category": "social",
    "subcategory": "12. ENGAJAMENTO E DIVERSIDADE",
    "text": "Existe uma politica de contratação inclusiva?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": "Não",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_12.6",
    "category": "social",
    "subcategory": "12. ENGAJAMENTO E DIVERSIDADE",
    "text": "Qual o percentual de trabalhadores são Pessoas Com Deficiência (PcDs)?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Até 10%",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Entre 10% e 15%",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Entre 15% e 25%",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "50% ou mais",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_13.1",
    "category": "social",
    "subcategory": "13. FORNECEDORES",
    "text": "Os critérios socioambientais são considerados na escolha dos fornecedores?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": "Não",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_13.2",
    "category": "social",
    "subcategory": "13. FORNECEDORES",
    "text": "Qual o percentual dos seus fornecedores pertencem ao mercado local?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não monitoramos.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Até 10%",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Entre 10% e 15%",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Entre 15% e 25%",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "50% ou mais",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_13.3",
    "category": "social",
    "subcategory": "13. FORNECEDORES",
    "text": "Existe um documento formal que declara o código de conduta de fornecedores ou avaliação periódica?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": "Não",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "social_13.4",
    "category": "social",
    "subcategory": "13. FORNECEDORES",
    "text": "Os fornecedores recebem treinamentos e passam por auditorias periódicas?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": "Não",
        "points": 0,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      },
      {
        "label": "PERGUNTAS",
        "value": "PERGUNTAS",
        "points": 0,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_14.1",
    "category": "governance",
    "subcategory": "14. CULTURA E VALORES",
    "text": "A empresa tem definida sua declaração de missão, visão e valores?",
    "inputType": "radio",
    "options": [
      {
        "label": "A empresa não tem definida sua declaração de missão, visão e valores.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "A empresa possui definição de missão, visão e valores, porém sem metas associadas.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "A declaração de missão, visão e valores possui metas e objetivos relacionados.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "A empresa tem a sustentabilidade incluida em sua missão e estratégia.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "A empresa  tem a sustentabilidade incluída em sua missão e estratégia e faz o monitoramento dos indicadores ESG",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_15.1",
    "category": "governance",
    "subcategory": "15. GESTÃO DA SATISFAÇÃO DO CLIENTE",
    "text": "A empresa realiza periodicamente pesquisas para saber a opinião de seus clientes, fornecedores e comunidade do entorno (stakeholders) para entender suas expectativas e necessidades?",
    "inputType": "radio",
    "options": [
      {
        "label": "A empresa não realiza pesquisas nem possui canal de atendimento ao consumidor.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "A empresa não realiza pesquisas e possui canal de atendimento ao consumidor.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "A empresa  realiza pesquisas em diversos canais para conhecer a opinião de seus clientes, fornecedores e da comunidade.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "A empresa realiza pesquisas com todas as suas partes interessadas, possui canal de atendimento ao fornecedor e canal de denúncias.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "A empresa possui seus stakeholders em esferas decisórias da empresa, conselho de diretores por exemplo.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_15.2",
    "category": "governance",
    "subcategory": "15. GESTÃO DA SATISFAÇÃO DO CLIENTE",
    "text": "A empresa monitora o grau de satisfação dos seus clientes?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_15.3",
    "category": "governance",
    "subcategory": "15. GESTÃO DA SATISFAÇÃO DO CLIENTE",
    "text": "A empresa possui procedimentos para acompanhamento e tratamento das reclamações/ sugestões recebidas em diferentes plataformas, inclusive redes sociais?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_16.1",
    "category": "governance",
    "subcategory": "16. QUALIDADE E SEGURANÇA DO PRODUTO",
    "text": "São oferecidas garantias extraordinárias além das estabelecidas em lei?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_17.1",
    "category": "governance",
    "subcategory": "17. ROTULAGEM E PRÁTICAS DE VENDA",
    "text": "A empresa possui em suas embalagens alguma certificação ou atributo identificado em suas embalagens?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_18.1",
    "category": "governance",
    "subcategory": "18. GERENCIAMENTO DE RISCOS",
    "text": "A empresa realizou o estudo e formou a sua matriz de materialidade para entender quais os principais riscos ESG para o negócio?",
    "inputType": "radio",
    "options": [
      {
        "label": "A empresa não realizou ainda o estudo da sua matriz de materialidade.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Conhecemos nossos riscos, mas em nível gerencial, sem a devida divulgação e gestão.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Realizamos a matriz de materialidade de forma interna, consultando a alta direção.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Realizamos a matriz de materialidade de dupla materialidade, consultando a alta direção e as partes interessadas (stakeholders).",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "A matriz de materialidade está publicada em nosso último relatorio de sustentabilidade.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_18.2",
    "category": "governance",
    "subcategory": "18. GERENCIAMENTO DE RISCOS",
    "text": "A empresa adota procedimentos para a gestão dos seus riscos ESG?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_19.1",
    "category": "governance",
    "subcategory": "19. GESTÃO DE REQUISITOS LEGAIS",
    "text": "A empresa possui todas as autorizações necessárias para a sua atuação?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_19.2",
    "category": "governance",
    "subcategory": "19. GESTÃO DE REQUISITOS LEGAIS",
    "text": "A empresa atualiza periodicamente a sua análise de requisitos legais?",
    "inputType": "radio",
    "options": [
      {
        "label": "Não",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Sim",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_20.1",
    "category": "governance",
    "subcategory": "20. ETICA E TRANSPARÊNCIA",
    "text": "A empresa possui uma cultura de conduta clara sobre práticas de relacionamento ético com o poder público, fornecedores e clientes?",
    "inputType": "radio",
    "options": [
      {
        "label": "A empresa não define as práticas de relacionamento.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Na empresa, os funcionários não conhecem bem a formalização das condutas.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "SIM, mas ainda não estão definidas em normas internas da empresa.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "SIM, as condutas estão definidas em normas e práticas éticas divulgadas na empresa.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "As normas estão definidas, formalizadas, divulgadas e os funcionários sáo treinados pelo menos anualmente.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_20.2",
    "category": "governance",
    "subcategory": "20. ETICA E TRANSPARÊNCIA",
    "text": "O relatório financeiro da sua empresa atende:",
    "inputType": "radio",
    "options": [
      {
        "label": "Não possuímos relatório financeiro divulgado.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Possuímos relatório financeiro o qual divulgamos internamente.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Nosso relatório financeiro atende às normas de contabilidade locais.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Nosso relatório financeiro atende às normas de contabilidade internacionais.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Nosso relatório financeiro é auditado por entidade externa.",
        "value": 5,
        "points": 5,
        "weight": 1
      }
    ]
  },
  {
    "id": "governance_20.3",
    "category": "governance",
    "subcategory": "20. ETICA E TRANSPARÊNCIA",
    "text": "Relatórios de Sustentabilidade",
    "inputType": "radio",
    "options": [
      {
        "label": "Não possuímos relatório de sustentabilidade divulgado.",
        "value": 1,
        "points": 1,
        "weight": 1
      },
      {
        "label": "Possuímos relatório de sustentabilidade o qual divulgamos internamente.",
        "value": 2,
        "points": 2,
        "weight": 1
      },
      {
        "label": "Divulgamos nossos indicadores de sustentabilidade em nosso site.",
        "value": 3,
        "points": 3,
        "weight": 1
      },
      {
        "label": "Nosso relatório de sustentabilidade é realizado segundo as normas GRI.",
        "value": 4,
        "points": 4,
        "weight": 1
      },
      {
        "label": "Nosso relatório de sustentabilidade pelas normas GRI já estão no segundo ano ou mais de reporte.",
        "value": 5,
        "points": 5,
        "weight": 1
      },
      {
        "label": "PERGUNTAS",
        "value": "PERGUNTAS",
        "points": 0,
        "weight": 1
      }
    ]
  }
];

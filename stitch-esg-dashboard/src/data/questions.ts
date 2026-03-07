export interface QuestionOption {
  label: string;
  value: number | string;
}

export interface Question {
  id: string;
  category: 'form' | 'environmental' | 'social' | 'governance';
  subcategory?: string;
  text: string;
  description?: string;
  options?: QuestionOption[];
  inputType?: 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox';
}

export const diagnosticQuestions: Question[] = [
  {
    "id": "form_1.1",
    "category": "form",
    "subcategory": "IDENTIFICAÇÃO",
    "text": "Nome da Empresa",
    "inputType": "text"
  },
  {
    "id": "form_1.2",
    "category": "form",
    "subcategory": "IDENTIFICAÇÃO",
    "text": "CNPJ",
    "inputType": "text",
    "description": "Apenas números"
  },
  {
    "id": "form_1.3",
    "category": "form",
    "subcategory": "ESCOPO",
    "text": "Escopo da avaliação",
    "inputType": "text",
    "description": "Informe o período dos dados (Ex: Janeiro/2024 a Dezembro/2024)"
  },
  {
    "id": "form_1.4",
    "category": "form",
    "subcategory": "CATEGORIA",
    "text": "Setor de Atuação",
    "options": [
      { "label": "Atacado/Varejo", "value": "atacado_varejo" },
      { "label": "Fabricação", "value": "fabricacao" },
      { "label": "Serviço", "value": "servico" }
    ]
  },
  {
    "id": "form_1.5",
    "category": "form",
    "subcategory": "CATEGORIA",
    "text": "Tipo de Produto/Serviço",
    "options": [
      { "label": "Móveis em madeira", "value": "moveis_madeira" },
      { "label": "Móveis Planejados", "value": "moveis_planejados" },
      { "label": "Estofados", "value": "estofados" },
      { "label": "Móveis de metal", "value": "moveis_metal" },
      { "label": "Outros", "value": "outros" }
    ]
  },
  {
    "id": "form_1.6",
    "category": "form",
    "subcategory": "ATIVIDADE",
    "text": "Atividade Principal",
    "options": [
      { "label": "Design e fabricação", "value": "design_fabricacao" },
      { "label": "Venda e distribuição", "value": "venda_distribuicao" },
      { "label": "E-commerce", "value": "ecommerce" },
      { "label": "Outros", "value": "outros" }
    ]
  },
  {
    "id": "form_1.6a",
    "category": "form",
    "subcategory": "ATIVIDADE",
    "text": "Sobre a segurança dos dados em seu ambiente digital",
    "options": [
      { "label": "Não temos qualquer solução de segurança de dados", "value": "nenhuma_seguranca" },
      { "label": "Possuímos políticas e práticas de privacidade", "value": "politicas_privacidade" },
      { "label": "LGPD compliance", "value": "lgpd" }
    ]
  },
  {
    "id": "form_1.7",
    "category": "form",
    "subcategory": "FUNCIONÁRIOS",
    "text": "Número de Funcionários",
    "options": [
      { "label": "0 - 10 funcionários", "value": "0_10" },
      { "label": "10 - 50 funcionários", "value": "10_50" },
      { "label": "50 - 100 funcionários", "value": "50_100" },
      { "label": "100 - 200 funcionários", "value": "100_200" },
      { "label": "Acima de 200 funcionários", "value": "200_plus" }
    ]
  },
  {
    "id": "form_1.8",
    "category": "form",
    "subcategory": "SEDE",
    "text": "Cidade",
    "inputType": "text"
  },
  {
    "id": "form_1.9",
    "category": "form",
    "subcategory": "SEDE",
    "text": "Estado",
    "inputType": "select",
    "options": [
      { "label": "Acre", "value": "AC" },
      { "label": "Alagoas", "value": "AL" },
      { "label": "Amapá", "value": "AP" },
      { "label": "Amazonas", "value": "AM" },
      { "label": "Bahia", "value": "BA" },
      { "label": "Ceará", "value": "CE" },
      { "label": "Distrito Federal", "value": "DF" },
      { "label": "Espírito Santo", "value": "ES" },
      { "label": "Goiás", "value": "GO" },
      { "label": "Maranhão", "value": "MA" },
      { "label": "Mato Grosso", "value": "MT" },
      { "label": "Mato Grosso do Sul", "value": "MS" },
      { "label": "Minas Gerais", "value": "MG" },
      { "label": "Pará", "value": "PA" },
      { "label": "Paraíba", "value": "PB" },
      { "label": "Paraná", "value": "PR" },
      { "label": "Pernambuco", "value": "PE" },
      { "label": "Piauí", "value": "PI" },
      { "label": "Rio de Janeiro", "value": "RJ" },
      { "label": "Rio Grande do Norte", "value": "RN" },
      { "label": "Rio Grande do Sul", "value": "RS" },
      { "label": "Rondônia", "value": "RO" },
      { "label": "Roraima", "value": "RR" },
      { "label": "Santa Catarina", "value": "SC" },
      { "label": "São Paulo", "value": "SP" },
      { "label": "Sergipe", "value": "SE" },
      { "label": "Tocantins", "value": "TO" }
    ]
  },
  {
    "id": "form_1.10",
    "category": "form",
    "subcategory": "PROPRIEDADE",
    "text": "A empresa pertence a:",
    "options": [
      { "label": "Propriedade familiar", "value": "familiar" },
      { "label": "Pertence a mulheres", "value": "mulheres" },
      { "label": "Pertence a pessoa LGBTQIAPN+", "value": "lgbtqiapn" },
      { "label": "Pertence a pessoa negra ou indígena", "value": "negra_indigena" },
      { "label": "Pessoa com deficiência", "value": "deficiencia" }
    ]
  }
];

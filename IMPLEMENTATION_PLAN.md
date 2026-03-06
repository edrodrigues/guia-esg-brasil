# Plano de Implementação: React + Firebase

Este documento detalha o plano passo a passo para transformar os protótipos estáticos em uma aplicação funcional completa.

## 1. Configuração do Ambiente e Boilerplate
*   [x] **Inicializar Projeto React:** Vite + TypeScript.
*   [x] **Instalar Tailwind CSS:** Integrado com a nova engine v4.
*   [x] **Configurar Firebase:**
    *   [x] Criar projeto no Firebase Console.
    *   [x] Habilitar **Authentication** (Email/Password, Google).
    *   [x] Habilitar **Cloud Firestore** (Banco de dados NoSQL).
    *   [x] Habilitar **Storage** (Configurado no SDK).
    *   [x] Configurar o SDK do Firebase no projeto (`firebase/app`, `firebase/auth`, `firebase/firestore`).

## 2. Estrutura de Dados (Firestore)
*   [x] **Coleção `users`:** `{ uid, name, email, companyId, role, avatarUrl }`
*   [x] **Coleção `companies`:** `{ id, name, industry, region, currentXP, level, esgScores: { environmental, social, governance } }`
*   [x] **Coleção `diagnostics`:** `{ id, companyId, responses: { q1: answer, ... }, completed: boolean, lastUpdated }`
*   [x] **Coleção `missions`:** `{ id, companyId, title, status, leader, deadline, type: 'E'|'S'|'G' }`
*   [ ] **Coleção `ranking`:** (Planejado para Fase 5).

## 3. Desenvolvimento dos Componentes Base (UI Kit)
*   [x] Extrair componentes reutilizáveis:
    *   [x] `Sidebar`: Navegação lateral fixa.
    *   [x] `Header`: Barra superior com busca e perfil.
    *   [x] `Card`: Container padrão para métricas.
    *   [x] `Button`: Estilos primário, secundário, outline e ghost.
    *   [ ] `Badge`: Componente dedicado (atualmente usado de forma inline nos status).

## 4. Implementação das Telas (Iterativo)

### Fase 1: Autenticação e Perfil [CONCLUÍDO]
*   [x] Criar telas de Login e Registro.
*   [x] Implementar persistência de sessão com `Firebase Auth`.
*   [x] Tela de Perfil da Empresa (dados básicos).

### Fase 2: Dashboard Principal [CONCLUÍDO]
*   [x] Implementar os cards de score (E, S, G) consumindo dados do Firestore.
*   [x] Integrar biblioteca de gráficos (`Recharts`) para a "Evolução da Jornada".
*   [x] Listagem dinâmica de Missões Recentes.

### Fase 3: Diagnóstico Interativo [CONCLUÍDO]
*   [x] Desenvolver o motor do questionário (passo a passo).
*   [x] Salvar respostas parciais no Firestore.
*   [x] Lógica de cálculo: Atualizar o Score ESG e XP da empresa ao finalizar seções.
*   [x] Geração automática de missões baseada nas respostas.

### Fase 4: Jornada do Herói e Gamificação [PRÓXIMO]
*   [ ] Criar o componente visual da jornada (Step Indicator vertical/curvo).
*   [ ] Lógica de Levels: `level = Math.floor(currentXP / 1000)`.
*   [ ] Animações de "Level Up" e notificações de conquistas.

### Fase 5: Ranking de Mestres
*   [ ] Criar query no Firestore para listar empresas ordenadas por XP.
*   [ ] Implementar filtros por Indústria e Região.
*   [ ] Destaque visual para a posição da empresa logada no ranking.

## 5. Funcionalidades Avançadas
*   [ ] **Exportação de PDF:** Usar `jspdf` para gerar relatórios baseados nos dados.
*   [ ] **Dark Mode:** Implementar via context provider e Tailwind.
*   [ ] **Offline Support:** Ativar persistência de dados do Firestore para uso instável.

## 6. Testes e Deploy
*   [ ] **Testes:** Jest/React Testing Library para lógica de cálculo de scores.
*   [ ] **Deploy:** Firebase Hosting para a aplicação web.
*   [ ] **CI/CD:** Configurar GitHub Actions para deploy automático.

# 🌿 Guia ESG Brasil | Stitch Dashboard

[![Vercel Deployment](https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge&logo=vercel)](https://stitch-esg-dashboard.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Enterprise Ready](https://img.shields.io/badge/Design-Emerald_Glass-10b981?style=for-the-badge)](./EMERALD_GLASS_DESIGN_SYSTEM.md)

> **Democratizando a sustentabilidade corporativa.** O Guia ESG Brasil é uma plataforma gamificada de alta performance que transforma dados complexos de ESG (Ambiental, Social e Governança) em uma jornada visual de progresso e impacto real.

---

## 🚀 Visão Geral

O projeto foi desenhado para atender desde **CEOs** que buscam relatórios analíticos de alta integridade até **Colaboradores** engajados em missões de impacto sustentável. Através do sistema de design **Emerald Glass**, unimos a sofisticação do glassmorphism com a autoridade técnica necessária para o ambiente corporativo.

### Principais Funcionalidades

*   **⚡ Diagnóstico Gamificado:** Avaliação de maturidade ESG em menos de 15 minutos com feedback em tempo real.
*   **📊 Enterprise Dashboard:** Visualização de dados analíticos utilizando a biblioteca **Tremor**, focada em KPIs críticos.
*   **🏆 Placar de Líderes (Ranking):** Comparação setorial e nacional de performance ESG com badges de status (Elite, Proativo, etc.).
*   **🌿 Pilares Dedicados:** Áreas específicas para monitoramento de Carbono (E), Impacto Social (S) e Conformidade Ética (G).
*   **📈 Relatórios de Impacto:** Geração de sumários visuais prontos para conselhos de administração e investidores.

---

## 🛠 Tech Stack

*   **Frontend:** React 19 (Hooks, Suspense, Lazy Loading)
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS v4 (Modern, CSS-first)
*   **Gráficos:** Tremor Library (Charts de nível enterprise)
*   **Backend & Auth:** Firebase (Cloud Firestore, Auth, Storage)
*   **Ícones:** Lucide React & Google Material Symbols
*   **Bundler:** Vite 7 (Configurado com Vendor Chunk Splitting)

---

## 🎨 Design System: Emerald Glass

A interface utiliza uma linguagem visual proprietária chamada **Emerald Glass**:
*   **Base:** Sustentabilidade Emerald (`#10b981`).
*   **Efeito:** Glassmorphism sutil (Intensidade 3/10) com `backdrop-blur-md`.
*   **Tipografia:** `Fira Sans` para interface e `Fira Code` para integridade de dados numéricos.
*   **Layout:** Sidebar flutuante e cards com elevação ambiente.

---

## 📦 Instalação e Uso

### Pré-requisitos
*   Node.js 20+
*   NPM ou Yarn

### Configuração
1.  Clone o repositório:
    ```bash
    git clone https://github.com/edrodrigues/stitch-dashboard-de-gestao-esg.git
    ```
2.  Navegue até a pasta da aplicação:
    ```bash
    cd stitch-esg-dashboard
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Configure as variáveis de ambiente no arquivo `.env` (Firebase Config):
    ```env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    ```
5.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

---

## 🏗 Estrutura do Projeto

```text
src/
├── components/       # Componentes UI, Layout e Dashboards
├── context/          # Provedores de Estado (Auth, Diagnóstico)
├── data/             # Mock data e perguntas do diagnóstico
├── pages/            # Views principais (Dashboard, Ranking, Pillars)
├── types/            # Definições de interfaces TypeScript
└── firebase.ts       # Inicialização do SDK Firebase
```

---

## ⚡ Performance

A aplicação foi otimizada para carregamento instantâneo:
*   **Code Splitting:** Carregamento sob demanda de todas as rotas.
*   **Vendor Splitting:** Separação de bibliotecas pesadas (Firebase, Tremor) para cache otimizado.
*   **Preconnect:** Fontes e recursos críticos carregados antecipadamente.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com ❤️ pela equipe **Stitch ESG**.

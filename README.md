# 📚 SIGRA - Sistema de Gestão de Repositório Acadêmico

Sistema web para gerenciamento e compartilhamento de arquivos acadêmicos entre estudantes e administradores universitários.

<h4 align="center">Built with the tools and technologies:</h4>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white" alt="npm" />
  <img src="https://img.shields.io/badge/EmailJS-F4A460?style=flat&logo=gmail&logoColor=white" alt="EmailJS" />
  <img src="https://img.shields.io/badge/.ENV-ECD53F?style=flat&logo=dotenv&logoColor=black" alt=".ENV" />
</p>

---

## ✨ Funcionalidades

### Para Estudantes
- 📤 Upload e publicação de arquivos acadêmicos
- 📁 Gerenciamento de arquivos pessoais
- 🔍 Exploração de materiais por curso, semestre e disciplina
- 👤 Configurações de perfil e alteração de senha

### Para Administradores
- ✅ Validação de matrículas de novos estudantes
- 👥 Gerenciamento de usuários
- 📊 Dashboard com estatísticas do sistema
- 🎓 Gerenciamento de cursos

### Geral
- 🔐 Sistema de autenticação seguro
- 📧 Recuperação de senha por e-mail
- 🌙 Interface moderna e responsiva
- 📱 Compatível com dispositivos móveis

## 🛠️ Tecnologias

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Animações:** Framer Motion
- **Ícones:** Lucide React
- **E-mail:** EmailJS
- **Build:** Vite

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no [Supabase](https://supabase.com)
- Conta no [EmailJS](https://emailjs.com) (para recuperação de senha)

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/sigra.git
cd sigra
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# App Configuration
VITE_SITE_URL=https://sua-url.vercel.app

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=seu-service-id
VITE_EMAILJS_TEMPLATE_ID=seu-template-id
VITE_EMAILJS_PUBLIC_KEY=sua-public-key
```

4. **Configure o banco de dados**

Execute os scripts SQL na pasta `sql/` no seu projeto Supabase:
- `supabase-schema.sql` - Schema principal do banco

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Visualiza o build de produção |

## 🗂️ Estrutura do Projeto

```
sigra/
├── components/       # Componentes reutilizáveis
├── contexts/         # Contextos React (Auth, Toast)
├── lib/              # Configurações (Supabase)
├── pages/            # Páginas da aplicação
├── services/         # Serviços de API
├── sql/              # Scripts SQL do banco
├── src/              # Utilitários e hooks
├── App.tsx           # Componente principal
├── types.ts          # Definições de tipos
└── index.tsx         # Entry point
```

## 🔐 Tipos de Usuário

| Tipo | Permissões |
|------|------------|
| **Admin** | Validar matrículas, gerenciar usuários, visualizar relatórios |
| **Student** | Publicar arquivos, gerenciar próprios arquivos, explorar materiais |

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel
3. Deploy automático a cada push

### Build Manual
```bash
npm run build
```
Os arquivos serão gerados na pasta `dist/`

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido com ❤️ para a comunidade acadêmica

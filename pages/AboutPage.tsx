import React from 'react';
import { Link } from 'react-router-dom';
import { SigraLogoIcon, UsersIcon, BookOpenIcon, ShieldCheckIcon, ChartBarIcon, ArrowLeftOnRectangleIcon } from '../components/icons';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  color: string;
  bio: string;
  skills: string[];
  email?: string;
  linkedin?: string;
  github?: string;
}

const AboutPage: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState('hero');
  const [showSidebar, setShowSidebar] = React.useState(false);

  // Scroll spy effect
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'team', 'technologies', 'stats'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teamMembers: TeamMember[] = [
    { 
      name: 'Fernando', 
      role: 'Desenvolvedor Full Stack', 
      avatar: 'FE', 
      color: 'from-blue-500 to-blue-700',
      bio: 'Especialista em desenvolvimento full stack com foco em arquitetura de sistemas escaláveis. Responsável pela integração entre frontend e backend do SIGRA.',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
      email: 'fernando@sigra.com'
    },
    { 
      name: 'Joaquim', 
      role: 'Desenvolvedor Backend', 
      avatar: 'JO', 
      color: 'from-purple-500 to-purple-700',
      bio: 'Expert em desenvolvimento backend e APIs RESTful. Implementou toda a lógica de negócio e integração com Supabase no SIGRA.',
      skills: ['Supabase', 'PostgreSQL', 'API Design', 'Node.js', 'SQL'],
      email: 'joaquim@sigra.com'
    },
    { 
      name: 'Gustavo', 
      role: 'Desenvolvedor Frontend', 
      avatar: 'GU', 
      color: 'from-green-500 to-green-700',
      bio: 'Desenvolvedor frontend apaixonado por criar interfaces intuitivas e responsivas. Responsável pela implementação dos componentes React do SIGRA.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'UI/UX', 'Responsive Design'],
      email: 'gustavo@sigra.com'
    },
    { 
      name: 'Michel', 
      role: 'Designer UI/UX', 
      avatar: 'MI', 
      color: 'from-orange-500 to-orange-700',
      bio: 'Designer focado em experiência do usuário e interfaces modernas. Criou todo o design system e identidade visual do SIGRA.',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
      email: 'michel@sigra.com'
    },
    { 
      name: 'Dauan', 
      role: 'Analista de Sistemas', 
      avatar: 'DA', 
      color: 'from-pink-500 to-pink-700',
      bio: 'Analista de sistemas com expertise em modelagem de dados e requisitos. Responsável pela arquitetura de informação e fluxos do SIGRA.',
      skills: ['Modelagem de Dados', 'UML', 'Requisitos', 'SQL', 'Análise de Sistemas'],
      email: 'dauan@sigra.com'
    },
    { 
      name: 'Tcharlison', 
      role: 'Gerente de Projeto', 
      avatar: 'TC', 
      color: 'from-indigo-500 to-indigo-700',
      bio: 'Gerente de projetos com foco em metodologias ágeis. Coordenou todo o desenvolvimento do SIGRA, garantindo entregas de qualidade.',
      skills: ['Scrum', 'Agile', 'Gestão de Equipes', 'Planejamento', 'Comunicação'],
      email: 'tcharlison@sigra.com'
    },
  ];

  const handleTeamPageClick = () => {
    // Criar HTML para página completa da equipe
    const teamHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Equipe SIGRA - Conheça Nossos Desenvolvedores</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
          }
          .container {
            max-width: 1400px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            color: white;
            margin-bottom: 60px;
          }
          .logo {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 16px;
            text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          .subtitle {
            font-size: 24px;
            opacity: 0.95;
            margin-bottom: 8px;
          }
          .description {
            font-size: 18px;
            opacity: 0.85;
            max-width: 600px;
            margin: 0 auto;
          }
          .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
          }
          .member-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .member-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }
          .member-header {
            text-align: center;
            margin-bottom: 24px;
          }
          .avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            color: white;
            margin: 0 auto 20px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          }
          .name {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .role {
            font-size: 16px;
            color: #6b7280;
            font-weight: 500;
          }
          .bio {
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 20px;
            font-size: 15px;
          }
          .skills-title {
            font-size: 14px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
          }
          .skill {
            padding: 6px 14px;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 500;
            color: white;
          }
          .contact {
            background: #f3f4f6;
            padding: 16px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            color: #4b5563;
          }
          .contact svg {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
          }
          .footer {
            text-align: center;
            color: white;
            padding: 40px 20px;
            margin-top: 40px;
          }
          .footer-logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 12px;
          }
          .footer-text {
            opacity: 0.9;
            font-size: 16px;
          }
          @media (max-width: 768px) {
            .team-grid {
              grid-template-columns: 1fr;
            }
            .logo {
              font-size: 36px;
            }
            .subtitle {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎓 SIGRA</div>
            <div class="subtitle">Nossa Equipe de Desenvolvimento</div>
            <div class="description">
              Conheça os profissionais talentosos que tornaram o SIGRA uma realidade
            </div>
          </div>
          
          <div class="team-grid">
            ${teamMembers.map(member => `
              <div class="member-card">
                <div class="member-header">
                  <div class="avatar" style="background: linear-gradient(135deg, ${member.color.replace('from-', '#').replace(' to-', ', #')});">
                    ${member.avatar}
                  </div>
                  <div class="name">${member.name}</div>
                  <div class="role">${member.role}</div>
                </div>
                
                <p class="bio">${member.bio}</p>
                
                <div class="skills-title">💼 Habilidades</div>
                <div class="skills">
                  ${member.skills.map(skill => `
                    <span class="skill" style="background: linear-gradient(135deg, ${member.color.replace('from-', '#').replace(' to-', ', #')});">
                      ${skill}
                    </span>
                  `).join('')}
                </div>
                
                ${member.email ? `
                  <div class="contact">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <span>${member.email}</span>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
          
          <div class="footer">
            <div class="footer-logo">SIGRA</div>
            <div class="footer-text">
              Sistema de Gestão de Repositório Acadêmico<br>
              © 2025
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Abrir nova aba com a página da equipe
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(teamHTML);
      newWindow.document.close();
    }
  };

  const handleMemberClick = (member: TeamMember) => {
    // Criar HTML para a nova aba com informações detalhadas
    const memberHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${member.name} - SIGRA Team</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .container {
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 100%;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, ${member.color.replace('from-', '#').replace(' to-', ', #')});
            padding: 60px 40px;
            text-align: center;
            color: white;
          }
          .avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: bold;
            margin: 0 auto 20px;
            border: 4px solid rgba(255, 255, 255, 0.3);
          }
          .name {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .role {
            font-size: 18px;
            opacity: 0.9;
          }
          .content {
            padding: 40px;
          }
          .section {
            margin-bottom: 32px;
          }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .bio {
            color: #4b5563;
            line-height: 1.6;
            font-size: 16px;
          }
          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .skill {
            background: linear-gradient(135deg, ${member.color.replace('from-', '#').replace(' to-', ', #')});
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
          }
          .contact {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 12px;
          }
          .contact-item {
            color: #4b5563;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .contact-item:last-child {
            margin-bottom: 0;
          }
          .icon {
            width: 20px;
            height: 20px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background: #f9fafb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="avatar">${member.avatar}</div>
            <div class="name">${member.name}</div>
            <div class="role">${member.role}</div>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">
                📝 Sobre
              </div>
              <p class="bio">${member.bio}</p>
            </div>
            
            <div class="section">
              <div class="section-title">
                🚀 Habilidades
              </div>
              <div class="skills">
                ${member.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
              </div>
            </div>
            
            ${member.email ? `
            <div class="section">
              <div class="section-title">
                📧 Contato
              </div>
              <div class="contact">
                <div class="contact-item">
                  <svg class="icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  ${member.email}
                </div>
              </div>
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <strong>SIGRA</strong> - Sistema de Gestão de Repositório Acadêmico<br>
            © 2024 Todos os direitos reservados
          </div>
        </div>
      </body>
      </html>
    `;

    // Abrir nova aba com o conteúdo
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(memberHTML);
      newWindow.document.close();
    }
  };

  const features = [
    {
      icon: <BookOpenIcon className="w-8 h-8" />,
      title: 'Repositório Acadêmico',
      description: 'Compartilhe e acesse trabalhos acadêmicos organizados por curso, semestre e disciplina.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <UsersIcon className="w-8 h-8" />,
      title: 'Gestão de Usuários',
      description: 'Sistema completo de gerenciamento de alunos e administradores com controle de acesso.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Segurança Avançada',
      description: 'Autenticação segura com bcrypt e políticas de Row Level Security do Supabase.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: 'Estatísticas em Tempo Real',
      description: 'Acompanhe métricas de downloads, usuários ativos e arquivos publicados.',
      color: 'bg-orange-100 text-orange-600'
    },
  ];

  const technologies = [
    { name: 'React', description: 'Biblioteca JavaScript para interfaces' },
    { name: 'TypeScript', description: 'Superset tipado do JavaScript' },
    { name: 'Supabase', description: 'Backend as a Service com PostgreSQL' },
    { name: 'Tailwind CSS', description: 'Framework CSS utility-first' },
    { name: 'Vite', description: 'Build tool moderno e rápido' },
    { name: 'React Router', description: 'Roteamento para aplicações React' },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowSidebar(false);
  };

  const sections = [
    { id: 'hero', label: 'Início', icon: '🏠' },
    { id: 'features', label: 'Funcionalidades', icon: '⚡' },
    { id: 'team', label: 'Equipe', icon: '👥' },
    { id: 'technologies', label: 'Tecnologias', icon: '🚀' },
    { id: 'stats', label: 'Estatísticas', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-gray-50 via-white to-brand-blue-50 relative">
      {/* Floating Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-64`}>
        <div className="p-6 border-b border-brand-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SigraLogoIcon className="w-8 h-8 text-brand-blue-600" />
              <span className="font-bold text-lg text-brand-gray-800">SIGRA</span>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-2 hover:bg-brand-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? 'bg-brand-blue-600 text-white shadow-lg'
                    : 'text-brand-gray-700 hover:bg-brand-gray-100'
                }`}
              >
                <span className="text-xl">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-gradient-to-br from-brand-blue-50 to-indigo-50 rounded-xl">
            <p className="text-sm text-brand-gray-700 font-medium mb-2">
              💡 Dica
            </p>
            <p className="text-xs text-brand-gray-600">
              Clique nos membros da equipe para ver perfis detalhados!
            </p>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowSidebar(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        <svg className="w-6 h-6 text-brand-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Hero Section */}
        <div id="hero" className="relative overflow-hidden bg-gradient-to-r from-brand-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-3xl">
                <SigraLogoIcon className="w-24 h-24 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
              SIGRA
            </h1>
            <p className="text-2xl md:text-3xl font-light mb-4 text-blue-100">
              Sistema de Gestão de Repositório Acadêmico
            </p>
            <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto mb-8">
              Plataforma moderna para compartilhamento e organização de trabalhos acadêmicos,
              desenvolvida com as melhores tecnologias do mercado.
            </p>
            <div className="flex justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-brand-blue-600 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                <SigraLogoIcon className="w-8 h-8" />
                SIGRA
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-gray-800 mb-4">
            Funcionalidades Principais
          </h2>
          <p className="text-xl text-brand-gray-600 max-w-2xl mx-auto">
            Uma plataforma completa para gerenciar e compartilhar conhecimento acadêmico
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-brand-gray-200 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-brand-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div id="team" className="bg-gradient-to-br from-brand-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-brand-blue-100 text-brand-blue-700 rounded-full font-semibold mb-6">
              <UsersIcon className="w-5 h-5" />
              Nossa Equipe
            </div>
            <h2 className="text-4xl font-bold text-brand-gray-800 mb-4">
              Desenvolvido por Especialistas
            </h2>
            <p className="text-xl text-brand-gray-600 max-w-2xl mx-auto">
              Conheça os profissionais que tornaram o SIGRA uma realidade
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                onClick={() => handleMemberClick(member)}
                className="group bg-white p-8 rounded-2xl border border-brand-gray-200 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    {member.avatar}
                  </div>
                  <h3 className="text-2xl font-bold text-brand-gray-800 mb-2 group-hover:text-brand-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-brand-gray-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <div className="mt-2 px-4 py-2 bg-brand-gray-100 text-brand-gray-600 rounded-lg text-sm font-medium group-hover:bg-brand-blue-100 group-hover:text-brand-blue-700 transition-colors">
                    Clique para ver perfil →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div id="technologies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-gray-800 mb-4">
            Tecnologias Utilizadas
          </h2>
          <p className="text-xl text-brand-gray-600 max-w-2xl mx-auto">
            Stack moderno e robusto para garantir performance e escalabilidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-brand-gray-200 hover:border-brand-blue-300 hover:shadow-lg transition-all"
            >
              <h3 className="text-lg font-bold text-brand-gray-800 mb-2">
                {tech.name}
              </h3>
              <p className="text-brand-gray-600 text-sm">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" className="bg-gradient-to-r from-brand-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">2024</div>
              <div className="text-blue-200">Ano de Criação</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">6</div>
              <div className="text-blue-200">Desenvolvedores</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-blue-200">Open Source</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">∞</div>
              <div className="text-blue-200">Possibilidades</div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => scrollToSection('hero')}
        className="fixed bottom-8 right-8 p-4 bg-brand-blue-600 text-white rounded-full shadow-2xl hover:bg-brand-blue-700 transition-all hover:scale-110 z-30"
        aria-label="Voltar ao topo"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Footer */}
      <footer className="bg-brand-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <SigraLogoIcon className="w-10 h-10" />
              <div>
                <div className="font-bold text-xl">SIGRA</div>
                <div className="text-sm text-brand-gray-400">Sistema de Gestão de Repositório Acadêmico</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-brand-gray-400 text-sm">
                © 2024 SIGRA.
              </p>
              <p className="text-brand-gray-500 text-xs mt-1">
                Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default AboutPage;

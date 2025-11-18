import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SigraLogoIcon, UsersIcon, BookOpenIcon, ShieldCheckIcon, ChartBarIcon } from '../components/icons';
import './AboutPage.css';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  color: string;
  bio: string;
  skills: string[];
  email?: string;
}

const AboutPage: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = React.useState<number | null>(null);
  const [hoveredMember, setHoveredMember] = React.useState<number | null>(null);
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const teamMembers: TeamMember[] = [
    { 
      name: 'Fernando', 
      role: 'Full Stack Developer', 
      avatar: 'FE', 
      color: 'from-cyan-500 to-blue-600',
      bio: 'Arquiteto de sistemas escaláveis',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      email: 'fernando@sigra.com'
    },
    { 
      name: 'Joaquim', 
      role: 'Backend Engineer', 
      avatar: 'JO', 
      color: 'from-violet-500 to-purple-600',
      bio: 'Especialista em APIs e integrações',
      skills: ['Supabase', 'PostgreSQL', 'API Design'],
      email: 'joaquim@sigra.com'
    },
    { 
      name: 'Gustavo', 
      role: 'Full Stack Developer', 
      avatar: 'GU', 
      color: 'from-emerald-500 to-green-600',
      bio: 'Desenvolvedor full stack',
      skills: ['React', 'TypeScript', 'Supabase'],
      email: 'gustavo@sigra.com'
    },
    { 
      name: 'Michel', 
      role: 'UI/UX Designer', 
      avatar: 'MI', 
      color: 'from-amber-500 to-orange-600',
      bio: 'Designer de experiências digitais',
      skills: ['Figma', 'UI Design', 'Design Systems'],
      email: 'michel@sigra.com'
    },
    { 
      name: 'Dauan', 
      role: 'Systems Analyst', 
      avatar: 'DA', 
      color: 'from-rose-500 to-pink-600',
      bio: 'Arquiteto de informação',
      skills: ['Modelagem', 'UML', 'SQL'],
      email: 'dauan@sigra.com'
    },
    { 
      name: 'Tcharlison', 
      role: 'Project Manager', 
      avatar: 'TC', 
      color: 'from-indigo-500 to-blue-700',
      bio: 'Líder ágil e estrategista',
      skills: ['Scrum', 'Agile', 'Liderança'],
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
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  const getBorderColor = (gradient: string) => {
    const colorMap: { [key: string]: string } = {
      'from-cyan-500 to-blue-600': '#06b6d4',
      'from-violet-500 to-purple-600': '#8b5cf6',
      'from-emerald-500 to-green-600': '#10b981',
      'from-amber-500 to-orange-600': '#f59e0b',
      'from-rose-500 to-pink-600': '#f43f5e',
      'from-indigo-500 to-blue-700': '#6366f1',
    };
    return colorMap[gradient] || '#3b82f6';
  };

  const features = [
    {
      icon: <BookOpenIcon className="w-6 h-6" />,
      title: 'Repositório Inteligente',
      description: 'Organize e compartilhe trabalhos acadêmicos com busca avançada e categorização automática.',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: 'Gestão Simplificada',
      description: 'Controle de acesso granular com perfis de aluno e administrador.',
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: 'Segurança Total',
      description: 'Criptografia de ponta a ponta e políticas RLS do Supabase.',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: 'Analytics Real-time',
      description: 'Dashboards interativos com métricas de uso e engajamento.',
      gradient: 'from-amber-500 to-orange-600'
    },
  ];

  const technologies = [
    { name: 'React 19', icon: '⚛️', color: 'text-cyan-600' },
    { name: 'TypeScript', icon: '📘', color: 'text-blue-600' },
    { name: 'Supabase', icon: '🔥', color: 'text-emerald-600' },
    { name: 'Tailwind', icon: '🎨', color: 'text-sky-600' },
    { name: 'Vite', icon: '⚡', color: 'text-purple-600' },
    { name: 'Framer Motion', icon: '✨', color: 'text-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-brand-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <SigraLogoIcon className="w-8 h-8 text-brand-blue-600" />
              <span className="font-bold text-xl text-brand-gray-900">SIGRA</span>
            </div>
            <Link
              to="/app"
              className="px-5 py-2.5 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700 transition-colors text-sm font-semibold shadow-sm"
            >
              Acessar Sistema
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Logo Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg mb-8"
              >
                <SigraLogoIcon className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Sistema Acadêmico</span>
              </motion.div>

              {/* Main Title */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                SIGRA
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
                Repositório Acadêmico Moderno
              </p>

              <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto mb-12">
                Compartilhe conhecimento, organize trabalhos e colabore com sua comunidade acadêmica
              </p>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-blue-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all hover:bg-brand-blue-700"
                >
                  Começar Agora
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section - Bento Grid */}
        <section className="py-24 bg-brand-gray-25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <motion.span variants={itemVariants} className="inline-block px-4 py-2 bg-brand-blue-50 text-brand-blue-700 rounded-full text-sm font-semibold mb-4">
                Recursos
              </motion.span>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-brand-gray-900 mb-4">
                Tudo que você precisa
              </motion.h2>
              <motion.p variants={itemVariants} className="text-lg text-brand-gray-600 max-w-2xl mx-auto">
                Ferramentas poderosas para transformar a gestão acadêmica
              </motion.p>
            </motion.div>

            {/* Bento Grid Layout */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {/* Feature 1 */}
              <motion.div
                variants={itemVariants}
                onMouseEnter={() => setHoveredFeature(0)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group relative overflow-hidden rounded-2xl bg-white p-6 border-2 transition-all duration-300 ${
                  hoveredFeature === 0 ? 'border-brand-blue-600 shadow-lg' : 'border-brand-gray-200'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors duration-300 ${
                  hoveredFeature === 0 ? 'bg-brand-blue-600' : 'bg-brand-blue-50'
                }`}>
                  <BookOpenIcon className={`w-6 h-6 transition-colors duration-300 ${
                    hoveredFeature === 0 ? 'text-white' : 'text-brand-blue-600'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-brand-gray-900 mb-2">
                  Repositório Inteligente
                </h3>
                <p className="text-sm text-brand-gray-600 leading-relaxed">
                  Organize e compartilhe trabalhos acadêmicos com busca avançada e categorização automática.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                variants={itemVariants}
                onMouseEnter={() => setHoveredFeature(1)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group relative overflow-hidden rounded-2xl bg-white p-6 border-2 transition-all duration-300 ${
                  hoveredFeature === 1 ? 'border-brand-blue-600 shadow-lg' : 'border-brand-gray-200'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors duration-300 ${
                  hoveredFeature === 1 ? 'bg-brand-blue-600' : 'bg-brand-blue-50'
                }`}>
                  <UsersIcon className={`w-6 h-6 transition-colors duration-300 ${
                    hoveredFeature === 1 ? 'text-white' : 'text-brand-blue-600'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-brand-gray-900 mb-2">
                  Gestão Simplificada
                </h3>
                <p className="text-sm text-brand-gray-600 leading-relaxed">
                  Controle de acesso granular com perfis de aluno e administrador.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                variants={itemVariants}
                onMouseEnter={() => setHoveredFeature(2)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group relative overflow-hidden rounded-2xl bg-white p-6 border-2 transition-all duration-300 ${
                  hoveredFeature === 2 ? 'border-brand-blue-600 shadow-lg' : 'border-brand-gray-200'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors duration-300 ${
                  hoveredFeature === 2 ? 'bg-brand-blue-600' : 'bg-brand-blue-50'
                }`}>
                  <ShieldCheckIcon className={`w-6 h-6 transition-colors duration-300 ${
                    hoveredFeature === 2 ? 'text-white' : 'text-brand-blue-600'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-brand-gray-900 mb-2">
                  Segurança Total
                </h3>
                <p className="text-sm text-brand-gray-600 leading-relaxed">
                  Criptografia de ponta a ponta e políticas RLS do Supabase.
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                variants={itemVariants}
                onMouseEnter={() => setHoveredFeature(3)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group relative overflow-hidden rounded-2xl bg-white p-6 border-2 transition-all duration-300 ${
                  hoveredFeature === 3 ? 'border-brand-blue-600 shadow-lg' : 'border-brand-gray-200'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 transition-colors duration-300 ${
                  hoveredFeature === 3 ? 'bg-brand-blue-600' : 'bg-brand-blue-50'
                }`}>
                  <ChartBarIcon className={`w-6 h-6 transition-colors duration-300 ${
                    hoveredFeature === 3 ? 'text-white' : 'text-brand-blue-600'
                  }`} />
                </div>
                <h3 className="text-lg font-bold text-brand-gray-900 mb-2">
                  Analytics Real-time
                </h3>
                <p className="text-sm text-brand-gray-600 leading-relaxed">
                  Dashboards interativos com métricas de uso e engajamento.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <motion.span variants={itemVariants} className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                Time
              </motion.span>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Conheça a equipe
              </motion.h2>
              <motion.p variants={itemVariants} className="text-lg text-gray-600">
                Profissionais dedicados ao desenvolvimento do SIGRA
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredMember(index)}
                  onMouseLeave={() => setHoveredMember(null)}
                  onClick={() => handleMemberClick(member)}
                  className="cursor-pointer"
                >
                  <div 
                    className="relative p-8 bg-white rounded-2xl border-2 transition-all duration-300"
                    style={{
                      borderColor: hoveredMember === index ? getBorderColor(member.color) : '#e5e7eb'
                    }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xl font-bold mb-4`}>
                        {member.avatar}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {member.role}
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        {member.bio}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {member.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Technologies Section - Infinite Carousel */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="text-center mb-16"
            >
              <motion.span variants={itemVariants} className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
                Stack
              </motion.span>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Tecnologias modernas
              </motion.h2>
              <motion.p variants={itemVariants} className="text-lg text-gray-600">
                Construído com as melhores ferramentas do mercado
              </motion.p>
            </motion.div>

            {/* Infinite Carousel */}
            <div className="relative">
              {/* White gradient mask overlay - fades on both sides */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(270deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 15%, rgba(255, 255, 255, 0) 85%, #FFFFFF 100%)'
                }}
              ></div>
              
              <div className="flex overflow-hidden py-4">
                <motion.div
                  className="flex gap-6"
                  animate={{
                    x: [0, -1680],
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 25,
                      ease: "linear",
                    },
                  }}
                >
                  {/* First set */}
                  {technologies.map((tech, index) => (
                    <div
                      key={`first-${index}`}
                      className="flex-shrink-0 group cursor-pointer"
                    >
                      <div className="px-8 py-5 bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{tech.icon}</span>
                          <span className={`font-bold text-lg ${tech.color} whitespace-nowrap`}>{tech.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Second set (duplicate for seamless loop) */}
                  {technologies.map((tech, index) => (
                    <div
                      key={`second-${index}`}
                      className="flex-shrink-0 group cursor-pointer"
                    >
                      <div className="px-8 py-5 bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{tech.icon}</span>
                          <span className={`font-bold text-lg ${tech.color} whitespace-nowrap`}>{tech.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Third set for extra smoothness */}
                  {technologies.map((tech, index) => (
                    <div
                      key={`third-${index}`}
                      className="flex-shrink-0 group cursor-pointer"
                    >
                      <div className="px-8 py-5 bg-white rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{tech.icon}</span>
                          <span className={`font-bold text-lg ${tech.color} whitespace-nowrap`}>{tech.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { value: '2025', label: 'Lançamento' },
                { value: '6', label: 'Desenvolvedores' },
                { value: '100%', label: 'Dedicação' },
                { value: '∞', label: 'Possibilidades' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <SigraLogoIcon className="w-8 h-8" />
                <div>
                  <div className="font-bold text-lg">SIGRA</div>
                  <div className="text-sm text-gray-400">Repositório Acadêmico</div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm">
                  © 2024 SIGRA. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Member Modal */}
      {selectedMember && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Header with gradient */}
              <div className={`relative bg-gradient-to-br ${selectedMember.color} p-12 text-white text-center`}>
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
                <div className="relative">
                  <div className={`inline-flex w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm items-center justify-center text-3xl font-bold mb-4 border-4 border-white/30`}>
                    {selectedMember.avatar}
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{selectedMember.name}</h2>
                  <p className="text-lg opacity-90">{selectedMember.role}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Bio */}
                <div>
                  <div className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                    <span className="text-xl">📝</span>
                    <h3 className="text-lg">Sobre</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedMember.bio}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <div className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                    <span className="text-xl">🚀</span>
                    <h3 className="text-lg">Habilidades</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-4 py-2 bg-gradient-to-br ${selectedMember.color} text-white rounded-xl text-sm font-medium shadow-sm`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                {selectedMember.email && (
                  <div>
                    <div className="flex items-center gap-2 text-gray-900 font-bold mb-3">
                      <span className="text-xl">📧</span>
                      <h3 className="text-lg">Contato</h3>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        <span className="text-sm">{selectedMember.email}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">SIGRA</span> - Sistema de Gestão de Repositório Acadêmico
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;

import { User, AcademicFile, Role, Enrollment, Course } from './types';

export const ADMIN_USER: User = {
  id: 1,
  name: 'Admin User',
  email: 'admin@sigra.com',
  role: Role.Admin,
  course: 'Administração',
  avatar: 'ADM',
  password: 'admin123',
};

export const STUDENT_USER: User = {
  id: 2,
  name: 'João Pedro Silva',
  email: 'joao.silva@sigra.com',
  role: Role.Student,
  course: 'Ciência da Computação',
  avatar: 'JPS',
  matricula: '20230101',
  password: 'student123',
};

export const MOCK_USERS: User[] = [ADMIN_USER, STUDENT_USER];

export const MOCK_FILES: AcademicFile[] = [
  // Ciência da Computação Files
  {
    id: 1,
    title: 'Trabalho 1 - Renderização de Terreno',
    author: 'João Silva Santos',
    course: 'Ciência da Computação',
    downloads: 45,
    uploadedAt: '2 dias atrás',
    semester: '2024.1',
    subject: 'Computação Gráfica',
    lastUpdateMessage: 'feat: Adiciona implementação inicial do shader',
    fileName: 'render_terreno.txt',
    fileType: 'text/plain',
    fileContent: 'Este é o conteúdo do Trabalho 1 sobre Renderização de Terreno. A implementação utiliza shaders para calcular a iluminação e a textura do terreno de forma eficiente.',
  },
  {
    id: 2,
    title: 'Apresentação sobre Ray Tracing',
    author: 'Maria Oliveira',
    course: 'Ciência da Computação',
    downloads: 78,
    uploadedAt: '5 dias atrás',
    semester: '2024.1',
    subject: 'Computação Gráfica',
    lastUpdateMessage: 'docs: Atualiza slides com novas referências',
    fileName: 'ray_tracing.txt',
    fileType: 'text/plain',
    fileContent: 'Apresentação sobre os conceitos fundamentais de Ray Tracing, incluindo interseção de raios, modelos de iluminação e otimizações.',
  },
  {
    id: 3,
    title: 'Relatório de Complexidade de Algoritmos',
    author: 'Pedro Costa',
    course: 'Ciência da Computação',
    downloads: 23,
    uploadedAt: '1 semana atrás',
    semester: '2023.2',
    subject: 'Teoria da Computação',
    lastUpdateMessage: 'fix: Corrige análise do algoritmo de Dijkstra',
    fileName: 'complexidade.txt',
    fileType: 'text/plain',
    fileContent: 'Análise de complexidade de tempo e espaço para os principais algoritmos de ordenação e busca. Inclui uma correção na análise do algoritmo de Dijkstra.',
  },
  {
    id: 6,
    title: 'Implementação de Árvore B+',
    author: 'Ana Clara',
    course: 'Ciência da Computação',
    downloads: 55,
    uploadedAt: '3 dias atrás',
    semester: '2024.1',
    subject: 'Estrutura de Dados II',
    lastUpdateMessage: 'refactor: Otimiza a função de busca',
    fileName: 'arvore_b_plus.cpp',
    fileType: 'text/x-c++src',
    fileContent: '// Implementação da Árvore B+ em C++\n// A função de busca foi otimizada para reduzir o número de acessos a disco.',
  },
  // Other Courses
  {
    id: 4,
    title: 'Estudo sobre Direito Constitucional Comparado',
    author: 'Ana Pereira',
    course: 'Direito',
    downloads: 112,
    uploadedAt: '2 semanas atrás',
    semester: '2024.1',
    subject: 'Direito Constitucional',
    lastUpdateMessage: 'feat: Adiciona capítulo sobre a constituição alemã',
    fileName: 'direito_comparado.txt',
    fileType: 'text/plain',
    fileContent: 'Estudo comparativo entre as constituições do Brasil, Estados Unidos e Alemanha, com foco nos direitos fundamentais.',
  },
  {
    id: 5,
    title: 'Impacto da Inteligência Artificial na Medicina',
    author: 'Carlos Souza',
    course: 'Medicina',
    downloads: 99,
    uploadedAt: '3 semanas atrás',
    semester: '2024.1',
    subject: 'Tópicos Avançados',
    lastUpdateMessage: 'docs: Revisa abstract e conclusões',
    fileName: 'ia_medicina.txt',
    fileType: 'text/plain',
    fileContent: 'Artigo sobre o impacto da IA no diagnóstico por imagem, na descoberta de medicamentos e na personalização de tratamentos.',
  },
];

export const MOCK_ENROLLMENTS: Enrollment[] = [
    { id: 1, studentName: 'Mariana Costa', courseName: 'Engenharia Civil', status: 'pending', matricula: '20240101', email: 'mariana.costa@university.com' },
    { id: 2, studentName: 'Lucas Ferreira', courseName: 'Medicina', status: 'pending', matricula: '20240102', email: 'lucas.ferreira@university.com' },
    { id: 3, studentName: 'Beatriz Almeida', courseName: 'Direito', status: 'pending', matricula: '20240103', email: 'beatriz.almeida@university.com' },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 1,
    name: 'Ciência da Computação',
    description: 'Estudo de algoritmos, estruturas de dados, desenvolvimento de software e inteligência artificial.',
  },
  {
    id: 2,
    name: 'Medicina',
    description: 'Formação de médicos para diagnóstico, tratamento e prevenção de doenças humanas.',
  },
  {
    id: 3,
    name: 'Direito',
    description: 'Estudo das normas jurídicas que regem as relações sociais e a resolução de conflitos.',
  },
  {
    id: 4,
    name: 'Sistemas de Informação',
    description: 'Foco na administração de recursos de tecnologia da informação em organizações.',
  },
    {
    id: 5,
    name: 'Engenharia Civil',
    description: 'Planejamento, projeto e construção de infraestruturas como edifícios, pontes e estradas.',
  },
];

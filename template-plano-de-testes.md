**PLANO DE TESTES - SISTEMA SIGRA**

**SIGRA - Sistema Integrado de Gestão de Repositório Acadêmico**

**Histórico da Revisão**

| Data | Versão | Descrição | Autor | Área/Setor |
| ----- | ----- | :---- | :---- | ----- | ----- |
| 05/11/2025 | 1.0 | Versão inicial do plano de testes | Equipe de Desenvolvimento | TI/Desenvolvimento |
| 05/11/2025 | 1.1 | Revisão e ajustes nos critérios de teste | Analista de Qualidade | QA |

**Identificação do Plano de Testes: SIGRA-PT-001**

**Plano de Testes do Sistema SIGRA - Repositório Acadêmico** 

 

# **1. Introdução**

**1.1. Objeto**

O SIGRA (Sistema Integrado de Gestão de Repositório Acadêmico) é uma aplicação web desenvolvida em React/TypeScript que permite o gerenciamento e compartilhamento de arquivos acadêmicos entre estudantes e administradores. O sistema oferece funcionalidades de autenticação, upload/download de arquivos, validação de matrículas, gerenciamento de usuários e exploração de conteúdo por curso e disciplina.

**1.2. Objetivo**

Este plano de testes tem como objetivo definir a estratégia, abordagem e procedimentos para validar todas as funcionalidades do sistema SIGRA, garantindo que o software atenda aos requisitos funcionais e não-funcionais especificados. Os testes visam identificar defeitos, verificar a usabilidade, performance e segurança do sistema antes de sua implantação em produção. 

 

# **2. Escopo**

**Funcionalidades que SERÃO testadas:**
- Sistema de autenticação (login/logout)
- Gerenciamento de sessões e persistência de dados
- Dashboard administrativo e do estudante
- Upload e download de arquivos acadêmicos
- Validação de matrículas pendentes
- Gerenciamento de usuários (CRUD)
- Exploração de arquivos por curso/disciplina
- Interface responsiva e usabilidade
- Integração com Supabase (quando disponível)
- Controle de acesso baseado em roles (Admin/Student)
- Funcionalidades de busca e filtros

**Funcionalidades que NÃO serão testadas:**
- Infraestrutura de servidor e deploy
- Configurações específicas do Supabase em produção
- Testes de penetração avançados
- Performance com grandes volumes de dados (>10GB)
- Compatibilidade com navegadores legados (IE, versões antigas)
- Funcionalidades ainda não implementadas (relatórios avançados) 

 

 

# **3. Abordagem**

A estratégia de teste do SIGRA será baseada em uma abordagem híbrida que combina técnicas funcionais (caixa-preta) e estruturais (caixa-branca), seguindo as melhores práticas de teste de software. 

**Técnicas de Teste Utilizadas:**
- **Teste Funcional**: Particionamento em classes de equivalência, análise de valor limite e teste baseado em casos de uso
- **Teste Estrutural**: Cobertura de comandos, decisões e caminhos críticos do código
- **Teste de Interface**: Validação da usabilidade e navegação da interface React
- **Teste de Integração**: Verificação das integrações com Supabase e entre componentes

**Ferramentas:**
- Navegadores: Chrome, Firefox, Safari, Edge
- Ferramentas de desenvolvimento: React DevTools, Chrome DevTools
- Simulação de dispositivos móveis
- Postman para testes de API (quando aplicável)

**Critérios de Iniciação:**
- Ambiente de desenvolvimento configurado
- Build da aplicação funcionando
- Dados de teste (mock) disponíveis

**Critérios de Aprovação:**
- 100% dos casos de teste críticos executados com sucesso
- Nenhum defeito de severidade alta em aberto
- Funcionalidades principais validadas

**Critérios de Encerramento:**
- Todos os testes planejados executados
- Defeitos documentados e priorizados
- Relatório de teste aprovado pela equipe 


# **4. Missão de Avaliação e Motivação dos Testes**

## **4.1 Fundamentos**

O SIGRA é um sistema web desenvolvido em React/TypeScript que visa centralizar o compartilhamento de arquivos acadêmicos entre estudantes e administradores universitários. O sistema resolve o problema da dispersão de materiais acadêmicos, oferecendo uma plataforma organizada por curso, semestre e disciplina.

A arquitetura da solução é baseada em uma SPA (Single Page Application) com React no frontend, utilizando Context API para gerenciamento de estado, React Router para navegação e integração planejada com Supabase para persistência de dados. O sistema implementa controle de acesso baseado em roles (Admin/Student) e funcionalidades de upload/download de arquivos.

O projeto encontra-se em fase de desenvolvimento ativo, com funcionalidades core implementadas usando dados mockados, preparando-se para integração com backend real. A qualidade do sistema é crítica pois lidará com dados acadêmicos sensíveis e precisa garantir segurança, usabilidade e confiabilidade.

## **4.2 Missão de Avaliação**

**Garantir que o sistema SIGRA atenda aos requisitos funcionais e não-funcionais especificados, identificando e documentando defeitos críticos que possam comprometer a experiência do usuário, a segurança dos dados ou a integridade das funcionalidades acadêmicas, assegurando que o produto esteja pronto para uso em ambiente educacional.**

## **4.3 Motivadores dos Testes**

**Riscos de Qualidade:**
- Perda ou corrupção de arquivos acadêmicos
- Falhas no controle de acesso e autenticação
- Problemas de usabilidade que impeçam o uso efetivo

**Riscos Técnicos:**
- Incompatibilidade entre navegadores
- Problemas de performance com múltiplos usuários
- Falhas na integração com Supabase

**Requisitos Funcionais Críticos:**
- Sistema de autenticação e autorização
- Upload e download de arquivos
- Validação de matrículas
- Navegação e busca de conteúdo

**Requisitos Não-Funcionais:**
- Responsividade em dispositivos móveis
- Tempo de resposta aceitável
- Segurança dos dados dos usuários 

 

# **5. Itens de Teste-Alvo**

**Componentes da Aplicação (Prioridade Alta):**
- App.tsx - Componente principal e roteamento
- Páginas principais: Dashboard, LoginPage, ValidateEnrollmentsPage
- Sistema de autenticação (AuthContext.tsx)
- Componentes de interface: Sidebar, Header, FileList
- Gerenciamento de estado e navegação

**Funcionalidades Core (Prioridade Alta):**
- Sistema de login/logout e controle de sessão
- Dashboard administrativo e do estudante
- Upload e visualização de arquivos
- Validação de matrículas pendentes
- Controle de acesso baseado em roles

**Integrações Externas (Prioridade Média):**
- Integração com Supabase (quando disponível)
- Persistência de dados locais (localStorage)
- Gerenciamento de arquivos

**Ambiente de Execução (Prioridade Média):**
- Navegadores: Chrome 120+, Firefox 115+, Safari 16+, Edge 120+
- Dispositivos: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- Sistema operacional: Windows 10/11, macOS 12+, iOS 15+, Android 10+

**Dependências Técnicas (Prioridade Baixa):**
- React 19.1.1 e React Router DOM 7.9.1
- TypeScript 5.8.2
- Vite como bundler
- Tailwind CSS para estilização 

 

# **6. Resumo dos Testes Planejados**

## **6.1 Resumo das Inclusões dos Testes**

**Testes Funcionais:**
- Autenticação e autorização (login, logout, controle de acesso)
- Funcionalidades do dashboard (admin e estudante)
- Gerenciamento de arquivos (upload, download, visualização)
- Validação de matrículas e aprovação de usuários
- Navegação entre páginas e componentes
- Busca e filtros de conteúdo acadêmico

**Testes de Interface:**
- Responsividade em diferentes dispositivos
- Usabilidade e experiência do usuário
- Compatibilidade entre navegadores
- Validação de formulários e campos obrigatórios

**Testes de Integração:**
- Integração entre componentes React
- Gerenciamento de estado com Context API
- Roteamento e navegação
- Persistência de dados locais

**Testes de Segurança:**
- Controle de acesso baseado em roles
- Validação de sessões e tokens
- Proteção contra acesso não autorizado

## **6.2 Resumo dos Outros Candidatos a Possível Inclusão**

**Testes de Performance:**
- Tempo de carregamento com grandes volumes de arquivos
- Comportamento com múltiplos usuários simultâneos
- Otimização de bundle e recursos estáticos

**Testes de Acessibilidade:**
- Conformidade com WCAG 2.1
- Navegação por teclado
- Compatibilidade com leitores de tela

**Testes Automatizados:**
- Testes unitários para componentes críticos
- Testes end-to-end com Cypress ou Playwright

## **6.3 Resumo das Exclusões dos Testes**

**Testes de Infraestrutura:**
- Configuração de servidores e deploy - "Esses testes não contribuem para alcançar a missão de avaliação das funcionalidades da aplicação"

**Testes de Penetração Avançados:**
- Análise de vulnerabilidades de segurança complexas - "Não há recursos especializados suficientes para executar esses testes"

**Testes com Dados Reais:**
- Testes com dados de produção - "Esses testes são desnecessários devido ao uso de dados mockados representativos"

**Testes de Compatibilidade Legada:**
- Navegadores Internet Explorer e versões muito antigas - "Esses testes não contribuem para alcançar a missão de avaliação, pois o público-alvo usa navegadores modernos" 

 

 

# **7\.**     **Abordagem dos Testes** 

***\[Esta seção apresenta a estratégia recomendada para criar e implementar os testes necessários. As seções 3, Itens de Teste-Alvo, e 4, Resumo dos Testes Planejados, identificaram que itens serão testados e que tipos de testes serão executados. Esta seção descreve como esses testes serão realizados.*** 

***Um aspecto a ser considerado na abordagem dos testes é as técnicas que serão usadas. Deverá ser incluído um resumo de como cada técnica poderá ser implementada, de uma perspectiva manual e/ou automatizada, e os critérios para comprovar que a técnica é útil e eficaz. Para cada técnica, forneça uma descrição a seu respeito e defina por que é uma parte importante da abordagem dos testes resumindo brevemente como ela ajuda a alcançar a Missão de Avaliação ou como aborda os Motivadores dos Testes.*** 

***Outro aspecto a ser discutido nesta seção é os modelos de Erro ou Falha que são aplicáveis e as maneiras de abordar como avaliá-los.*** 

***À medida que definir cada aspecto da abordagem, você deverá atualizar a seção 10, Responsabilidades, Perfil da Equipe e Necessidades de Treinamento, para documentar a configuração do ambiente de teste e outros recursos que serão necessários para implementar cada aspecto.\]*** 

## **7.1 Catálogos Iniciais de Ideias de Teste e Outras Fontes de Referência**

**Fontes de Referência para Casos de Teste:**
- Documentação oficial do React e TypeScript
- Guias de boas práticas para aplicações SPA
- Padrões de usabilidade para sistemas acadêmicos
- Casos de uso documentados no código fonte
- Dados mockados (MOCK_FILES, MOCK_USERS, MOCK_ENROLLMENTS)

**Catálogo de Ideias de Teste:**
- Cenários de uso típicos de estudantes e administradores
- Fluxos de trabalho acadêmicos (upload, busca, download)
- Casos extremos (arquivos grandes, muitos usuários)
- Cenários de erro (falha de rede, dados inválidos)
- Testes de regressão para funcionalidades críticas

**Referências Técnicas:**
- Especificações de acessibilidade WCAG 2.1
- Diretrizes de UX para aplicações educacionais
- Padrões de segurança para sistemas web
- Documentação do Supabase para integração 

## **7.2**     **Tipos e Técnicas de Teste** 

 

### *7.2.1 Teste de Persistência de Dados e Estado*

| Objetivo da Técnica:  | Verificar a integridade dos dados armazenados localmente (localStorage) e o gerenciamento de estado da aplicação, garantindo que as informações de sessão, arquivos e usuários sejam mantidas corretamente.  |
| :---- | :---- |
| **Técnica:**  | Testar operações de CRUD nos dados mockados, validar persistência de sessões de usuário, verificar sincronização entre estado da aplicação e dados locais. Simular cenários de perda de conexão e recuperação de dados. |
| **Estratégias:**  | Verificar dados no localStorage através do DevTools, validar estado dos componentes React, confirmar que dados são restaurados após refresh da página. Usar React DevTools para monitorar mudanças de estado. |
| **Ferramentas Necessárias:**  | Chrome DevTools, React DevTools, ferramentas de inspeção de localStorage, scripts de teste manuais para manipulação de dados |
| **Critérios de Êxito:**  | Todos os dados críticos (sessão, arquivos, usuários) são persistidos corretamente. Estado da aplicação permanece consistente após operações de CRUD. |
| **Considerações Especiais:**  | Como o sistema usa dados mockados, focar na consistência do estado React e localStorage. Preparar cenários para futura integração com Supabase. |

 

### *7.2.2 Teste de Funcionamento*

| Objetivo da Técnica:  | Validar todas as funcionalidades principais do SIGRA através da interface do usuário, verificando fluxos de trabalho completos, regras de negócio e comportamentos esperados para diferentes tipos de usuários (Admin/Student). |
| :---- | :---- |
| **Técnica:**  | Executar cenários de uso reais: login/logout, navegação no dashboard, upload/download de arquivos, validação de matrículas, busca de conteúdo. Testar com dados válidos e inválidos, verificar mensagens de erro e validações de formulário. |
| **Estratégias:**  | Usar técnicas de particionamento em classes de equivalência e análise de valor limite. Verificar visualmente os resultados na interface, validar redirecionamentos, confirmar atualizações de estado em tempo real. |
| **Ferramentas Necessárias:**  | Navegadores web (Chrome, Firefox, Safari, Edge), ferramentas de desenvolvedor, simuladores de dispositivos móveis, arquivos de teste para upload |
| **Critérios de Êxito:**  | Todos os fluxos principais funcionam conforme especificado. Controle de acesso por roles funciona corretamente. Validações e mensagens de erro são exibidas adequadamente. |
| **Considerações Especiais:**  | Testar diferentes tipos de arquivos para upload. Verificar comportamento com dados mockados vs. integração futura com Supabase. Validar responsividade em diferentes tamanhos de tela. |

 

### *7.2.3 Teste de Fluxos Acadêmicos*

| Objetivo da Técnica:  | Simular os ciclos típicos de uso acadêmico do SIGRA, incluindo períodos letivos, processos de matrícula, publicação de materiais e atividades sazonais de estudantes e administradores. |
| :---- | :---- |
| **Técnica:**  | Executar cenários que simulem: início de semestre (validação de matrículas em massa), período de aulas (upload/download intensivo), final de semestre (picos de atividade), períodos de férias (baixa atividade). Testar com múltiplos usuários simultâneos. |
| **Estratégias:**  | Criar cenários temporais que representem diferentes momentos do calendário acadêmico. Monitorar comportamento do sistema durante picos de uso. Verificar consistência de dados ao longo do tempo. |
| **Ferramentas Necessárias:**  | Múltiplas sessões de navegador, ferramentas de simulação de carga, scripts para criação de dados de teste em volume, cronômetros para medir tempos de resposta |
| **Critérios de Êxito:**  | Sistema mantém performance adequada durante picos de uso. Dados permanecem consistentes ao longo dos ciclos. Funcionalidades críticas não são afetadas por uso intensivo. |
| **Considerações Especiais:**  | Simular cenários realistas de uso acadêmico. Considerar diferentes padrões de uso entre estudantes e administradores. Preparar para testes de carga quando integração com Supabase estiver ativa. |

 

### *7.2.4 Teste de Interface do Usuário*

| Objetivo da Técnica:  | Verificar a usabilidade, acessibilidade e responsividade da interface React do SIGRA, garantindo navegação intuitiva, design consistente e experiência adequada em diferentes dispositivos e navegadores. |
| :---- | :---- |
| **Técnica:**  | Testar navegação entre páginas, funcionamento de menus e sidebar, responsividade em diferentes resoluções, validação de formulários, feedback visual de ações, estados de loading e erro. Verificar acessibilidade por teclado. |
| **Estratégias:**  | Inspeção visual da interface, teste de navegação por teclado (Tab, Enter, Esc), verificação de elementos responsivos com DevTools, validação de contraste e legibilidade, teste de componentes interativos. |
| **Ferramentas Necessárias:**  | Navegadores com DevTools, simuladores de dispositivos móveis, ferramentas de acessibilidade (axe, WAVE), extensões para teste de contraste, teclado para navegação |
| **Critérios de Êxito:**  | Interface é intuitiva e consistente. Navegação funciona em todos os dispositivos testados. Elementos interativos respondem adequadamente. Formulários validam corretamente. |
| **Considerações Especiais:**  | Focar na experiência mobile-first. Verificar componentes React customizados. Testar estados de carregamento e transições. Validar feedback visual para ações do usuário. |

 

### *7.2.5 Teste de Performance*

| Objetivo da Técnica:  | Medir e avaliar os tempos de resposta, carregamento de páginas e operações críticas do SIGRA, identificando gargalos de performance e verificando se a aplicação atende aos requisitos de velocidade esperados pelos usuários. |
| :---- | :---- |
| **Técnica:**  | Medir tempos de: carregamento inicial da aplicação, navegação entre páginas, upload/download de arquivos, operações de busca e filtro, login/logout. Testar com diferentes tamanhos de arquivos e volumes de dados. |
| **Estratégias:**  | Usar Performance API do navegador, Network tab do DevTools, Lighthouse para auditoria de performance. Cronometrar operações críticas, monitorar uso de memória e CPU, verificar otimizações de bundle. |
| **Ferramentas Necessárias:**  | Chrome DevTools (Performance, Network, Lighthouse), ferramentas de monitoramento de recursos do sistema, arquivos de teste de diferentes tamanhos, cronômetros |
| **Critérios de Êxito:**  | Carregamento inicial < 3 segundos. Navegação entre páginas < 1 segundo. Upload de arquivos até 10MB sem travamentos. Operações de busca < 500ms. |
| **Considerações Especiais:**  | Como é uma SPA React, focar em otimizações de bundle e lazy loading. Considerar performance em dispositivos móveis com conexões lentas. Preparar métricas para comparação futura com Supabase. |

 

### *7.2.6 Teste de Carga Simulada*

| Objetivo da Técnica:  | Simular múltiplos usuários simultâneos utilizando o SIGRA para verificar como a aplicação se comporta sob diferentes cargas de trabalho, identificando limites de capacidade e pontos de degradação de performance. |
| :---- | :---- |
| **Técnica:**  | Abrir múltiplas abas/janelas simulando usuários simultâneos, executar operações concorrentes (login, upload, navegação), testar cenários de pico (início de semestre, prazos de entrega), monitorar comportamento com diferentes volumes de dados. |
| **Estratégias:**  | Usar múltiplas instâncias do navegador, scripts automatizados para simular ações de usuário, monitoramento de recursos do sistema (CPU, memória), verificação de consistência de dados sob carga. |
| **Ferramentas Necessárias:**  | Múltiplos navegadores/abas, ferramentas de automação (Selenium, Puppeteer), monitores de sistema (Task Manager, Activity Monitor), scripts de geração de carga |
| **Critérios de Êxito:**  | Sistema mantém funcionalidade com até 50 usuários simultâneos. Não há perda de dados ou corrupção de estado. Tempos de resposta permanecem aceitáveis (< 5 segundos). |
| **Considerações Especiais:**  | Como é uma aplicação frontend, focar em limites do navegador e gerenciamento de memória. Simular cenários realistas de uso acadêmico. Preparar para testes mais robustos com backend real. |

 

### *7.2.7 Teste de Stress*

| Objetivo da Técnica:  | Identificar os limites de capacidade do SIGRA e como o sistema se comporta em condições extremas, incluindo recursos limitados, operações intensivas e cenários de falha, para garantir degradação graceful. |
| :---- | :---- |
| **Técnica:**  | Testar com arquivos muito grandes (>100MB), simular conexão lenta/instável, limitar recursos do navegador, executar operações intensivas simultaneamente, testar com dados corrompidos ou inválidos. |
| **Estratégias:**  | Monitorar uso de memória do navegador, verificar comportamento com recursos limitados, observar como o sistema lida com falhas, testar recuperação após condições extremas, documentar pontos de falha. |
| **Ferramentas Necessárias:**  | Ferramentas de limitação de recursos, simuladores de conexão lenta, arquivos de teste grandes, monitores de memória e CPU, ferramentas de throttling de rede |
| **Critérios de Êxito:**  | Sistema não trava completamente sob stress. Mensagens de erro apropriadas são exibidas. Recuperação graceful após condições extremas. Dados não são corrompidos. |
| **Considerações Especiais:**  | Focar em limites do navegador e JavaScript. Testar comportamento com localStorage cheio. Simular falhas de rede durante uploads. Verificar memory leaks em uso prolongado.rar stress na rede talvez seja necessário que as ferramentas da rede a sobrecarreguem com mensagens ou pacotes.  O armazenamento persistente usado para o sistema deverá ser reduzido temporariamente a fim de restringir o espaço disponível para que o banco de dados se desenvolva.  Sincronize o acesso simultâneo dos clientes aos mesmos registros ou contas de dados.\]***  |

 

 

### *7.2.8 Teste de Volume*

| Objetivo da Técnica:  | Testar o SIGRA com grandes volumes de dados acadêmicos para identificar limites de capacidade e verificar se o sistema mantém performance adequada com repositórios extensos de arquivos e muitos usuários cadastrados. |
| :---- | :---- |
| **Técnica:**  | Criar cenários com milhares de arquivos mockados, centenas de usuários simulados, múltiplas sessões simultâneas executando operações de busca, upload e download. Testar navegação em listas extensas, filtros com grandes datasets, operações de CRUD em massa. |
| **Estratégias:**  | Monitorar performance do navegador com grandes volumes de dados, verificar tempo de renderização de listas extensas, observar comportamento de filtros e busca com muitos resultados, medir uso de memória durante operações volumosas. |
| **Ferramentas Necessárias:**  | Scripts de geração de dados em massa, ferramentas de monitoramento de performance (DevTools), geradores de arquivos de teste, monitores de memória e CPU |
| **Critérios de Êxito:**  | Sistema mantém responsividade com até 10.000 arquivos cadastrados. Busca e filtros funcionam adequadamente com grandes volumes. Interface não trava com listas extensas. |
| **Considerações Especiais:**  | Como é uma aplicação frontend, focar em limites de renderização e gerenciamento de memória do navegador. Simular cenários realistas de universidades com muitos cursos e arquivos. |

 

### *7.2.9 Teste de Segurança e de Controle de Acesso*

| Objetivo da Técnica:  | Verificar que o controle de acesso baseado em roles (Admin/Student) do SIGRA funciona corretamente, garantindo que usuários só acessem funcionalidades e dados apropriados ao seu perfil, e que a autenticação protege adequadamente o sistema. |
| :---- | :---- |
| **Técnica:**  | Testar login com diferentes tipos de usuário (Admin/Student), verificar acesso a páginas restritas, tentar acessar URLs diretamente sem autenticação, validar expiração de sessão, testar logout e limpeza de dados sensíveis. |
| **Estratégias:**  | Usar diferentes contas de usuário para verificar permissões, tentar acessar rotas protegidas via URL direta, verificar redirecionamentos de segurança, inspecionar localStorage para dados sensíveis, testar comportamento após logout. |
| **Ferramentas Necessárias:**  | Navegadores com DevTools, contas de teste para diferentes roles, ferramentas de inspeção de rede, extensões de segurança para navegador |
| **Critérios de Êxito:**  | Estudantes não acessam funcionalidades administrativas. Usuários não autenticados são redirecionados para login. Sessões expiram adequadamente. Dados sensíveis não ficam expostos no cliente. |
| **Considerações Especiais:**  | Focar no controle de acesso do frontend React. Verificar proteção de rotas com ProtectedRoute. Testar persistência segura de sessões no localStorage. Validar limpeza de dados após logout. |

 

### *7.2.10 Teste de Tolerância a Falhas e de Recuperação*

| Objetivo da Técnica:  | Verificar como o SIGRA se comporta e se recupera de falhas inesperadas, incluindo perda de conexão, fechamento abrupto do navegador, falhas durante upload/download e corrupção de dados no localStorage. |
| :---- | :---- |
| **Técnica:**  | Simular falhas durante operações críticas: fechar navegador durante upload, desconectar internet durante operações, corromper dados do localStorage, interromper processos de login/logout, simular travamento do navegador. |
| **Estratégias:**  | Verificar recuperação de estado após reinicialização, validar integridade de dados após falhas, testar comportamento com localStorage corrompido, observar tratamento de erros de rede, documentar capacidade de recuperação. |
| **Ferramentas Necessárias:**  | Ferramentas de simulação de falhas de rede, scripts para corromper localStorage, monitores de estado da aplicação, ferramentas de backup de dados de teste |
| **Critérios de Êxito:**  | Sistema se recupera graciosamente após falhas. Dados não são perdidos ou corrompidos. Mensagens de erro apropriadas são exibidas. Estado da aplicação é restaurado adequadamente. |
| **Considerações Especiais:**  | Como é uma SPA, focar na recuperação de estado React e dados do localStorage. Testar comportamento offline/online. Verificar tratamento de erros de JavaScript. Simular cenários realistas de falha. |

 

### *7.2.11 Teste de Configuração*

| Objetivo da Técnica:  | Verificar o funcionamento do SIGRA em diferentes configurações de navegadores, sistemas operacionais, resoluções de tela e com diferentes aplicações executando simultaneamente no dispositivo do usuário. |
| :---- | :---- |
| **Técnica:**  | Testar em diferentes navegadores (Chrome, Firefox, Safari, Edge), sistemas operacionais (Windows, macOS, Linux, iOS, Android), resoluções de tela, com outros aplicativos abertos simultaneamente, diferentes configurações de zoom do navegador. |
| **Estratégias:**  | Executar casos de teste funcionais em cada configuração, verificar consistência visual e comportamental, documentar diferenças entre ambientes, validar responsividade em diferentes resoluções. |
| **Ferramentas Necessárias:**  | Múltiplos navegadores e versões, dispositivos com diferentes SOs, ferramentas de teste de responsividade, simuladores de dispositivos móveis |
| **Critérios de Êxito:**  | Sistema funciona consistentemente em todas as configurações suportadas. Interface se adapta adequadamente a diferentes resoluções. Performance mantém-se aceitável em configurações mínimas. |
| **Considerações Especiais:**  | Focar em navegadores modernos conforme especificado no escopo. Testar com aplicações típicas de estudantes (editores de texto, PDFs). Verificar comportamento com extensões de navegador comuns. |

 

### *7.2.12 Teste de Implantação e Acesso*

| Objetivo da Técnica:  | Verificar que o SIGRA pode ser acessado corretamente em diferentes cenários de implantação, incluindo primeiro acesso, cache do navegador, atualizações da aplicação e diferentes URLs de acesso. |
| :---- | :---- |
| **Técnica:**  | Testar primeiro acesso à aplicação, comportamento com cache do navegador, atualizações de versão, acesso via diferentes URLs, funcionamento após limpeza de cache, comportamento com JavaScript desabilitado. |
| **Estratégias:**  | Limpar cache e testar primeiro acesso, verificar carregamento de recursos estáticos, testar comportamento após atualizações, validar funcionamento em modo incógnito, documentar dependências críticas. |
| **Ferramentas Necessárias:**  | Navegadores com controle de cache, ferramentas de rede para monitorar carregamento, diferentes URLs de teste, ferramentas de limpeza de dados do navegador |
| **Critérios de Êxito:**  | Aplicação carrega corretamente no primeiro acesso. Recursos são cacheados adequadamente. Atualizações são aplicadas sem problemas. Funciona em modo incógnito. |
| **Considerações Especiais:**  | Como é uma SPA hospedada, focar no carregamento inicial e cache de recursos. Testar comportamento com CDNs. Verificar funcionamento com diferentes configurações de segurança do navegador. |

 

 

 

 

# **8. Critérios de Entrada e de Saída**

## **8.1 Plano de Teste**

### *8.1.1 Critérios de Entrada de Plano de Teste*

**Para iniciar a execução do plano de testes, os seguintes critérios devem ser atendidos:**
- Build da aplicação SIGRA funcionando e acessível
- Ambiente de desenvolvimento configurado e estável
- Dados de teste (mockados) carregados e disponíveis
- Navegadores de teste instalados e atualizados
- Casos de teste documentados e aprovados
- Equipe de teste treinada e disponível

### *8.1.2 Critérios de Saída de Plano de Teste*

**A execução do plano de testes será considerada concluída quando:**
- 100% dos casos de teste críticos executados com sucesso
- Todos os defeitos de severidade alta corrigidos e retestados
- Cobertura de teste atingiu os critérios mínimos estabelecidos
- Relatório final de testes aprovado pela equipe
- Funcionalidades principais validadas e aceitas
- Documentação de defeitos completa e atualizada

### *8.1.3 Critérios de Suspensão e de Reinício*

**Suspensão dos testes ocorrerá se:**
- Mais de 3 defeitos críticos (bloqueadores) identificados
- Build da aplicação instável ou inacessível
- Ambiente de teste comprometido
- Mudanças significativas nos requisitos

**Reinício dos testes após:**
- Correção dos defeitos bloqueadores
- Estabilização do ambiente de teste
- Aprovação das mudanças de requisitos
- Confirmação da equipe de desenvolvimento

## **8.2 Ciclos de Teste**

### *8.2.1 Critérios de Entrada de Ciclo de Teste*

**Para iniciar um novo ciclo de teste:**
- Build anterior testado e defeitos documentados
- Correções implementadas e disponíveis para teste
- Ambiente de teste limpo e configurado
- Casos de teste atualizados conforme necessário

### *8.2.2 Critérios de Saída de Ciclo de Teste*

**Um ciclo de teste será considerado suficiente quando:**
- Todos os casos de teste planejados executados
- Taxa de sucesso dos testes ≥ 95%
- Nenhum defeito crítico em aberto
- Métricas de qualidade dentro dos parâmetros aceitáveis

### *8.2.3 Término Anormal do Ciclo de Teste*

**Ciclo será interrompido prematuramente se:**
- Taxa de falha dos testes > 30%
- Defeitos críticos impedem continuidade dos testes
- Problemas técnicos graves no ambiente
- Mudanças urgentes nos requisitos do sistema 

# **9. Produtos Liberados**

## **9.1 Sumários de Avaliação de Testes**

**Relatórios Diários de Execução:**
- Status de execução dos casos de teste
- Defeitos identificados e seu status
- Métricas de progresso e cobertura
- Gerados diariamente durante a execução dos testes

**Relatórios Semanais de Progresso:**
- Resumo consolidado da semana
- Análise de tendências e riscos
- Recomendações para próximos passos
- Distribuídos às partes interessadas semanalmente

## **9.2 Geração de Relatórios sobre Cobertura de Teste**

**Métricas de Cobertura:**
- Percentual de casos de teste executados
- Cobertura de funcionalidades por módulo
- Cobertura de requisitos funcionais e não-funcionais
- Gerados ao final de cada ciclo de teste

**Ferramentas e Métodos:**
- Planilhas Excel para controle manual
- Screenshots e evidências de execução
- Logs de execução dos navegadores
- Relatórios consolidados em formato PDF

## **9.3 Relatórios da Qualidade Perceptível**

**Indicadores de Qualidade:**
- Taxa de defeitos por severidade
- Tempo médio de resolução de defeitos
- Índice de satisfação da equipe de desenvolvimento
- Métricas de performance e usabilidade

**Análise de Tendências:**
- Evolução da qualidade ao longo dos ciclos
- Comparação com critérios de aceitação
- Identificação de áreas de melhoria
- Gerados semanalmente e ao final do projeto

## **9.4 Registros de Incidentes e Solicitações de Mudança**

**Sistema de Rastreamento:**
- Planilha Excel com controle de defeitos
- Campos: ID, Descrição, Severidade, Status, Responsável
- Evidências anexadas (screenshots, logs)
- Atualização diária do status dos defeitos

**Processo de Gestão:**
- Triagem diária de novos defeitos
- Reuniões semanais de status
- Comunicação com equipe de desenvolvimento
- Aprovação de mudanças pela equipe

## **9.5 Conjunto de Testes de Regressão e Scripts de Teste de Suporte**

**Casos de Teste de Regressão:**
- Suite mínima de testes críticos
- Casos de teste para funcionalidades principais
- Procedimentos de teste documentados
- Scripts reutilizáveis para futuras versões

**Automação de Suporte:**
- Scripts para preparação de dados de teste
- Procedimentos de configuração de ambiente
- Checklists de verificação pré-teste
- Documentação de cenários de teste

## **9.6 Produtos de Trabalho Adicionais**

### *9.6.1 Resultados Detalhados dos Testes*

Planilha Excel detalhada contendo:
- Resultados individuais de cada caso de teste
- Evidências de execução (screenshots)
- Logs de erro e comportamentos observados
- Tempo de execução e observações

### *9.6.2 Scripts de Teste Funcionais Automatizados Adicionais*

- Scripts básicos para automação futura
- Procedimentos de teste documentados
- Configurações de ambiente automatizadas
- Templates para novos casos de teste

### *9.6.3 Guia de Teste*

Documentação incluindo:
- Boas práticas de teste para o SIGRA
- Padrões de nomenclatura e documentação
- Catálogo de defeitos comuns
- Orientações para testes futuros

### *9.6.4 Matrizes de Rastreabilidade*

- Matriz Requisitos x Casos de Teste
- Matriz Funcionalidades x Cobertura
- Matriz Defeitos x Casos de Teste
- Rastreabilidade de correções e retestes 

 

# **10. Fluxo de Trabalho de Teste**

## **10.1 Processo de Teste**

**Fase 1: Preparação (Semana 1)**
1. Configuração do ambiente de teste
2. Preparação dos dados de teste
3. Revisão e detalhamento dos casos de teste
4. Configuração das ferramentas de teste

**Fase 2: Execução de Testes Funcionais (Semana 2)**
1. Execução dos casos de teste críticos
2. Documentação de defeitos encontrados
3. Comunicação com equipe de desenvolvimento
4. Reteste de correções implementadas

**Fase 3: Testes de Interface e Usabilidade (Semana 3)**
1. Testes de responsividade
2. Testes de compatibilidade entre navegadores
3. Validação de usabilidade
4. Testes de acessibilidade básica

**Fase 4: Testes de Performance e Finalização (Semana 4)**
1. Testes de performance e carga
2. Testes de regressão
3. Consolidação de relatórios
4. Aprovação final e entrega

## **10.2 Atividades Diárias**

**Rotina Diária da Equipe de Teste:**
- 09:00 - Reunião de alinhamento (15 min)
- 09:15 - Execução de casos de teste
- 12:00 - Pausa para almoço
- 13:00 - Continuação dos testes
- 16:00 - Documentação de defeitos
- 17:00 - Atualização de relatórios
- 17:30 - Preparação para próximo dia

## **10.3 Comunicação e Reportes**

**Comunicação com Desenvolvimento:**
- Reuniões diárias de status (15 min)
- Comunicação imediata para defeitos críticos
- Reunião semanal de revisão de defeitos
- Validação de correções em até 24h

**Estrutura de Reportes:**
- Relatórios diários para equipe técnica
- Relatórios semanais para gestão
- Comunicação imediata para bloqueadores
- Relatório final consolidado 

# **11. Necessidades Ambientais**

## **11.1 Hardware Básico do Sistema**

| Recurso | Quantidade | Nome e Tipo |
| ----- | :---- | ----- |
| **Computadores de Teste** | 3 | Desktop/Laptop com diferentes SOs |
| **- Windows 10/11** | 1 | PC com 8GB RAM, processador i5 ou superior |
| **- macOS 12+** | 1 | MacBook ou iMac com 8GB RAM |
| **- Linux Ubuntu** | 1 | PC com 4GB RAM mínimo |
| **Dispositivos Móveis** | 2 | Para testes de responsividade |
| **- Smartphone Android** | 1 | Android 10+ com Chrome |
| **- iPhone/iPad** | 1 | iOS 15+ com Safari |
| **Conexão de Internet** | - | Banda larga estável (50Mbps+) |

## **11.2 Elementos de Software Básicos do Ambiente de Teste**

| Nome do Elemento de Software | Versão | Tipo e Outras Observações |
| ----- | ----- | ----- |
| **Google Chrome** | 120+ | Navegador principal para testes |
| **Mozilla Firefox** | 115+ | Navegador secundário |
| **Safari** | 16+ | Navegador para macOS/iOS |
| **Microsoft Edge** | 120+ | Navegador para Windows |
| **Windows 10/11** | Atual | Sistema Operacional |
| **macOS** | 12+ | Sistema Operacional |
| **Ubuntu Linux** | 22.04+ | Sistema Operacional |
| **Node.js** | 18+ | Para executar a aplicação localmente |

## **11.3 Ferramentas de Produtividade e de Suporte**

| Categoria ou Tipo de Ferramenta | Nome da Ferramenta | Fornecedor | Versão |
| ----- | ----- | ----- | ----- |
| **Gerenciamento de Teste** | Microsoft Excel | Microsoft | 365 |
| **Controle de Defeitos** | Planilha Excel | Interno | - |
| **Ferramenta de Desenvolvimento** | Chrome DevTools | Google | Integrado |
| **Ferramenta de Performance** | Lighthouse | Google | Integrado |
| **Monitor de Cobertura** | React DevTools | Meta | Extensão |
| **Gerenciamento de Projeto** | Trello/Jira | Atlassian | Web |
| **Captura de Tela** | Snipping Tool/Screenshot | SO | Nativo |

## **11.4 Configurações do Ambiente de Teste**

| Nome da Configuração | Descrição | Implementada na Configuração Física |
| ----- | :---- | ----- |
| **Configuração Padrão** | Desktop Windows com Chrome, resolução 1920x1080 | PC Windows principal |
| **Configuração Móvel** | Smartphone Android/iOS com navegadores nativos | Dispositivos móveis |
| **Configuração Mínima** | PC com 4GB RAM, resolução 1366x768 | PC Linux ou VM |
| **Configuração Multi-browser** | Todos os navegadores instalados para testes de compatibilidade | PC Windows/Mac |
| **Configuração de Performance** | Ambiente com ferramentas de monitoramento ativas | PC principal com DevTools |

# **12. Responsabilidades, Perfil da Equipe e Necessidades de Treinamento**

## **12.1 Estrutura da Equipe**

### *12.1.1 Analista de QA (Líder de Testes)*
**Responsabilidades:**
- Planejamento e coordenação dos testes
- Elaboração e revisão de casos de teste
- Gestão de defeitos e comunicação com desenvolvimento
- Consolidação de relatórios e métricas
- Aprovação final dos resultados de teste

**Perfil Necessário:**
- Experiência em teste de aplicações web
- Conhecimento de React e aplicações SPA
- Habilidades de comunicação e liderança
- Experiência com ferramentas de teste

### *12.1.2 Testador Funcional*
**Responsabilidades:**
- Execução de casos de teste funcionais
- Documentação detalhada de defeitos
- Testes de regressão
- Validação de correções
- Suporte na elaboração de evidências

**Perfil Necessário:**
- Experiência em teste manual
- Conhecimento básico de aplicações web
- Atenção aos detalhes
- Capacidade de documentação clara

### *12.1.3 Testador de Interface/UX*
**Responsabilidades:**
- Testes de usabilidade e interface
- Validação de responsividade
- Testes de compatibilidade entre navegadores
- Verificação de acessibilidade básica
- Testes em dispositivos móveis

**Perfil Necessário:**
- Experiência em testes de UI/UX
- Conhecimento de design responsivo
- Familiaridade com diferentes navegadores e dispositivos
- Senso estético e de usabilidade

## **12.2 Necessidades de Treinamento**

### *12.2.1 Treinamento Técnico*
**Sistema SIGRA:**
- Apresentação das funcionalidades do sistema
- Demonstração dos fluxos principais
- Explicação da arquitetura React/TypeScript
- Treinamento nos dados mockados

**Ferramentas de Teste:**
- Chrome DevTools para análise de performance
- React DevTools para debug de componentes
- Ferramentas de captura de evidências
- Planilhas de controle de defeitos

### *12.2.2 Treinamento em Processos*
**Metodologia de Teste:**
- Processo de execução de casos de teste
- Padrões de documentação de defeitos
- Fluxo de comunicação com desenvolvimento
- Critérios de aprovação e rejeição

**Ferramentas de Comunicação:**
- Sistema de gestão de defeitos
- Canais de comunicação da equipe
- Processo de escalação de problemas
- Reuniões e reportes regulares

## **12.3 Cronograma de Recursos**

| Semana | Analista QA | Testador Funcional | Testador UI/UX |
| ----- | :---- | :---- | :---- |
| **Semana 1** | 100% (Planejamento) | 50% (Preparação) | 25% (Configuração) |
| **Semana 2** | 100% (Coordenação) | 100% (Execução) | 50% (Testes UI) |
| **Semana 3** | 75% (Gestão) | 75% (Regressão) | 100% (Responsividade) |
| **Semana 4** | 100% (Finalização) | 50% (Suporte) | 25% (Validação) |

## **12.4 Matriz de Responsabilidades**

| Atividade | Analista QA | Testador Funcional | Testador UI/UX |
| ----- | :---- | :---- | :---- |
| **Planejamento de Testes** | Responsável | Consulta | Consulta |
| **Execução de Testes Funcionais** | Aprova | Responsável | Suporte |
| **Testes de Interface** | Aprova | Suporte | Responsável |
| **Gestão de Defeitos** | Responsável | Executa | Executa |
| **Relatórios Finais** | Responsável | Contribui | Contribui |
| **Comunicação com Dev** | Responsável | Suporte | Suporte |

---

**Documento aprovado e pronto para execução. Este plano de testes fornece uma base sólida e profissional para garantir a qualidade do sistema SIGRA antes de sua implantação em ambiente acadêmico.**ntos ou de habilidades exigidos desses recursos.\]*** 

**12.1**     **Pessoas e Papéis** 

## **Esta tabela mostra as suposições referentes ao perfil da equipe do esforço de teste. *\[Observação: Adicione ou exclua itens conforme o necessário.\]*** 

 

|  | Recursos Humanos  |  |
| ----- | ----- | ----- |
| **Papel**  | **Recursos Mínimos  Recomendáveis   (número de papéis alocados em tempo integral)**  | **Responsabilidades ou Comentários Específicos**  |
| **Gerente de  Testes**  |    | **Supervisiona o gerenciamento. Entre as responsabilidades estão incluídas:  planejamento e  logística**  **combinar missão**  **identificar motivadores**  **adquirir recursos apropriados**  **apresentar  relatórios de gerenciamento**  **defender os interesses do teste**  **avaliar a eficiência do esforço de teste**  |

| Analista de Teste  |    | Identifica e define os teste específicos a serem conduzidos. Entre as responsabilidades estão incluídas:  identificar ideias de teste  definir detalhes dos testes  determinar os resultados dos testes  documentar  solicitações de  mudança  avaliar a qualidade do produto  |
| :---- | :---- | ----- |
| **Designer de Teste**  |    | **Define a abordagem técnica referente à implementação do esforço de teste. Entre as responsabilidades estão incluídas:  definir a abordagem dos testes**  **definir a arquitetura de automação de  teste**  **verificar as técnicas de teste**  **definir os elementos de testabilidade**  **estruturar a implementação dos testes**  |

| Testador  |    | Implementa e executa os testes. Entre as responsabilidades estão incluídas:  implementar os  testes e os conjuntos de testes  executar os conjuntos de testes  registrar os resultados  analisar as falhas dos testes e possibilitar a recuperação posterior  documentar incidentes  |
| :---- | :---- | :---- |
| **Administrador do  Sistema de Teste**  |    | **Assegura a manutenção e o gerenciamento dos recursos e do ambiente do teste. Entre as responsabilidades estão incluídas:  administrar o sistema de gerenciamento de teste**  **instalar e suportar o acesso às configurações do ambiente de teste e aos laboratórios de teste, bem como a recuperação deles**  |

| Administrador do  Banco de Dados, Gerente do Banco de Dados  |    | Assegurar o gerenciamento e a manutenção dos recursos e do ambiente dos dados de teste (banco de dados). Entre as responsabilidades estão incluídas:  ● suportar a administração dos dados de teste e das plataformas de teste (banco de dados)  |
| :---- | :---- | ----- |
| **Designer**  |    | **Identifica e define as operações, os atributos e as associações das classes de teste. Entre as responsabilidades estão incluídas: ** ● **define as classes de teste necessárias para suportar os requisitos de estabilidade conforme definido pela equipe de teste**  |
| **Implementador**  |    | **Implementa as classes de teste e os pacotes de teste e efetua testes unitários nos mesmos. Entre as responsabilidades estão incluídas: ** ● **cria os componentes de teste necessários para suportar os requisitos de testabilidade conforme definido**  |
|  |  | **pelo designer**  |

 

### **12.2**     **Perfil da Equipe e Necessidades de Treinamento** 

**Esta seção resume como abordar o perfil da equipe e o treinamento dos profissionais que ocuparão os papéis de teste no projeto.**   
***\[O modo como abordar o perfil da equipe e o treinamento dos profissionais varia de projeto para projeto. Se esta seção integrar um Plano de Teste Mestre, indique em que pontos do ciclo de vida do projeto serão necessárias diferentes habilidades e um número diferente de integrantes da equipe. Se for um Plano de Teste de Iteração, você deverá concentrar-se principalmente em que momento, durante a Iteração, poderá ocorrer um treinamento e de que tipo ele será.*** 

***Reflita sobre suas necessidades de treinamento e planeje uma programação de treinamento com base em uma abordagem que sustente que o treinamento só deverá ser realizado no momento certo. Há sempre a tentação de realizar o treinamento muito antes de quando ele será realmente necessário, em um período em que a equipe de teste esteja aparentemente ociosa. Quando isso é feito, corre-se o risco de os ensinamentos do treinamento já terem sido esquecidos justamente no momento em que forem necessários.*** 

***Procure por oportunidades de combinar a compra de ferramentas de produtividade com o treinamento dessas ferramentas e retarde o treinamento, de comum acordo com o fornecedor, apenas para o momento em que for realmente necessário. Se tiver um número de pessoas suficiente, é recomendável realizar um treinamento personalizado, possivelmente no próprio local de sua organização.*** 

***Frequentemente, a equipe de teste necessita do suporte e das habilidades dos membros de outras equipes, que não a integram de forma direta. Certifique-se de programar, no seu plano, a participação adequada de Administradores de Sistema, Administradores de Banco de Dados e Desenvolvedores, que são profissionais necessários para viabilizar o esforço de teste.\]*** 

 

 

 

 

   
**Observações:**  

 

**O plano de teste é um dos documentos produzidos na condução de um projeto. Ele funciona como:** 

- **Um “integrador” entre diversas atividades de testes no projeto;** 

- **Mecanismo de comunicação para os *stakeholders* (isto é a equipe de testes e outros interessados);** 

- **Guia para execução e controle das atividades de testes.** 


**O plano de teste, que pode ser elaborado pelo gerente de projeto ou gerente de testes, visa planejar as atividades a serem realizadas, definir os métodos a serem empregados, planejar a capacidade necessária, estabelecer métricas e formas de acompanhamento do processo.** 

 

 

**Estas são as tarefas relacionadas a teste:** 

| 1.Planejar Teste  |
| :---- |
| **2.Identificar os Requisitos de Teste**  |
| **3.Avaliar o Risco**  |
| **4.Desenvolver a Estratégia de Teste**  |
| **5.Identificar os Recursos de Teste**  |
| **6.Criar Programação**  |
| **7.Gerar Plano de Teste**  |
| **8.Projetar Teste**  |
| **9.Análise da Carga de Trabalho**  |

| 10.Identificar e Descrever Casos de Teste  |
| :---- |
| **11.Identificar e Estruturar Procedimentos de Teste**  |
| **12.Revisar e Acessar a Cobertura de Teste**  |
| **13.Implementar Teste**  |
| **14.Registrar ou Programar Scripts de Teste**  |
| **15.Identificar a funcionalidade específica de Teste no modelo de design e de implementação**  |
| **16.Estabelecer Conjuntos de Dados Externos**  |
| **17.Executar Teste**  |
| **18.Executar os Procedimentos de Teste**  |
| **19.Avaliar a Execução do Teste**  |
| **20.Recuperar-se de uma Interrupção de Teste**  |
| **21.Verificar os Resultados**  |
| **22.Investigar os Resultados Inesperados**  |
| **23.Registrar Defeitos**  |
| **24.Avaliar Teste**  |
| **25.Avaliar Cobertura de Caso de Teste**  |
| **26.Avaliar Cobertura de Código**  |
| **27.Analisar os Defeitos**  |
| **28.Determinar se os Critérios de Conclusão e os Critérios de  Sucesso do Teste foram obedecidos**  |

 

 

 

 

 

 

 

 

 

 

 

 
# 
**8. Casos de Teste Específicos**

## **8.1 Casos de Teste de Autenticação**

**CT001 - Login com credenciais válidas**
- **Objetivo**: Verificar login bem-sucedido com usuário admin
- **Pré-condições**: Sistema carregado, usuário não logado
- **Passos**: 
  1. Acessar página de login
  2. Inserir email: admin@sigra.com
  3. Inserir senha: admin123
  4. Clicar em "Entrar"
- **Resultado Esperado**: Redirecionamento para dashboard administrativo
- **Prioridade**: Alta

**CT002 - Login com credenciais inválidas**
- **Objetivo**: Verificar tratamento de erro para credenciais incorretas
- **Passos**: Inserir email/senha inválidos
- **Resultado Esperado**: Mensagem de erro exibida, usuário permanece na tela de login
- **Prioridade**: Alta

## **8.2 Casos de Teste de Funcionalidades**

**CT003 - Upload de arquivo (Estudante)**
- **Objetivo**: Verificar funcionalidade de publicação de arquivo
- **Pré-condições**: Usuário estudante logado
- **Passos**:
  1. Navegar para "Publicar Arquivo"
  2. Preencher formulário com dados válidos
  3. Selecionar arquivo para upload
  4. Submeter formulário
- **Resultado Esperado**: Arquivo adicionado à lista, mensagem de sucesso
- **Prioridade**: Alta

**CT004 - Validação de matrícula (Admin)**
- **Objetivo**: Verificar processo de aprovação de matrícula
- **Pré-condições**: Admin logado, matrículas pendentes disponíveis
- **Passos**:
  1. Acessar "Validar Matrículas"
  2. Selecionar matrícula pendente
  3. Revisar dados do estudante
  4. Aprovar matrícula
- **Resultado Esperado**: Matrícula aprovada, usuário pode fazer login
- **Prioridade**: Alta

## **8.3 Casos de Teste de Interface**

**CT005 - Responsividade Mobile**
- **Objetivo**: Verificar adaptação da interface em dispositivos móveis
- **Passos**: Acessar sistema em dispositivo mobile ou simulador
- **Resultado Esperado**: Interface adaptada, funcionalidades acessíveis
- **Prioridade**: Média

**CT006 - Navegação entre páginas**
- **Objetivo**: Verificar funcionamento do menu e navegação
- **Passos**: Navegar por todas as opções do menu lateral
- **Resultado Esperado**: Todas as páginas carregam corretamente
- **Prioridade**: Média

# **9. Critérios de Aceitação**

## **9.1 Critérios Funcionais**
- ✅ Sistema de login/logout funciona corretamente
- ✅ Controle de acesso por roles implementado
- ✅ Upload e download de arquivos operacional
- ✅ Validação de matrículas funcional
- ✅ Dashboard exibe informações corretas
- ✅ Busca e filtros funcionam adequadamente

## **9.2 Critérios de Performance**
- ✅ Carregamento inicial < 3 segundos
- ✅ Navegação entre páginas < 1 segundo
- ✅ Upload de arquivos até 10MB sem problemas
- ✅ Sistema suporta 20+ usuários simultâneos

## **9.3 Critérios de Usabilidade**
- ✅ Interface intuitiva e consistente
- ✅ Responsiva em dispositivos móveis
- ✅ Mensagens de erro claras e úteis
- ✅ Navegação por teclado funcional

## **9.4 Critérios de Compatibilidade**
- ✅ Funciona em Chrome, Firefox, Safari, Edge
- ✅ Compatível com dispositivos móveis
- ✅ Suporte a diferentes resoluções de tela

# **10. Recursos e Responsabilidades**

## **10.1 Equipe de Teste**
- **Analista de QA**: Planejamento e execução de testes
- **Desenvolvedor Frontend**: Suporte técnico e correções
- **Product Owner**: Validação de requisitos e aceitação

## **10.2 Ambiente de Teste**
- **Hardware**: Computadores com diferentes SOs, dispositivos móveis
- **Software**: Navegadores atualizados, ferramentas de desenvolvimento
- **Dados**: Conjunto de dados mockados representativos

## **10.3 Cronograma**
- **Semana 1**: Testes funcionais críticos
- **Semana 2**: Testes de interface e usabilidade  
- **Semana 3**: Testes de performance e compatibilidade
- **Semana 4**: Testes de regressão e documentação

# **11. Riscos e Mitigações**

## **11.1 Riscos Identificados**
- **Risco**: Integração com Supabase pode afetar testes
- **Mitigação**: Manter testes com dados mockados funcionais

- **Risco**: Limitações de recursos para testes de carga
- **Mitigação**: Focar em testes de carga simulada com ferramentas disponíveis

- **Risco**: Mudanças de requisitos durante teste
- **Mitigação**: Manter comunicação constante com equipe de desenvolvimento

## **11.2 Plano de Contingência**
- Priorizar testes críticos em caso de tempo limitado
- Manter documentação atualizada de defeitos encontrados
- Estabelecer critérios mínimos de aceitação para release

# **12. Entregáveis**

## **12.1 Documentos**
- ✅ Plano de Testes (este documento)
- 📋 Casos de Teste Detalhados
- 📋 Relatório de Execução de Testes
- 📋 Relatório de Defeitos
- 📋 Relatório Final de Qualidade

## **12.2 Evidências**
- Screenshots de testes executados
- Logs de erro e comportamentos inesperados
- Métricas de performance coletadas
- Vídeos de testes de usabilidade (quando aplicável)

---

**Aprovações:**

| Papel | Nome | Assinatura | Data |
|-------|------|------------|------|
| Analista de QA | [Nome] | __________ | ___/___/2025 |
| Tech Lead | [Nome] | __________ | ___/___/2025 |
| Product Owner | [Nome] | __________ | ___/___/2025 |

---

*Este plano de testes foi elaborado seguindo as melhores práticas de engenharia de software e teste de sistemas, baseado na análise detalhada do sistema SIGRA e nos fundamentos teóricos de teste de software.*
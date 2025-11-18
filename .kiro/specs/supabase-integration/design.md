# Design Document - Integração Supabase no SIGRA

## Overview

Este documento descreve a arquitetura e design da integração do Supabase como backend do SIGRA. A solução implementa uma camada de serviços que abstrai as operações de banco de dados, mantém a estrutura de componentes React existente, e adiciona autenticação segura com controle de acesso baseado em roles.

### Objetivos de Design

1. **Separação de Responsabilidades**: Camada de serviços isolada da UI
2. **Type Safety**: TypeScript em toda a aplicação com tipos sincronizados ao schema
3. **Segurança**: Autenticação bcrypt + RLS policies do Supabase
4. **Performance**: Queries otimizadas, caching e paginação
5. **UX**: Loading states, error handling e feedback visual
6. **Manutenibilidade**: Código modular e testável

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Pages    │  │ Components │  │   Hooks    │        │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘        │
│        │               │               │                │
│        └───────────────┴───────────────┘                │
│                        │                                │
│              ┌─────────▼─────────┐                      │
│              │  Service Layer    │                      │
│              │  - authService    │                      │
│              │  - filesService   │                      │
│              │  - usersService   │                      │
│              │  - coursesService │                      │
│              │  - enrollService  │                      │
│              └─────────┬─────────┘                      │
│                        │                                │
│              ┌─────────▼─────────┐                      │
│              │  Supabase Client  │                      │
│              └─────────┬─────────┘                      │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │  Supabase Cloud  │
              │  - PostgreSQL    │
              │  - RLS Policies  │
              │  - Functions     │
              └──────────────────┘
```


### Directory Structure

```
src/
├── lib/
│   ├── supabase.ts              # Supabase client configuration
│   └── types/
│       └── database.ts          # Database types (generated or manual)
├── services/
│   ├── auth.service.ts          # Authentication operations
│   ├── files.service.ts         # Academic files CRUD
│   ├── users.service.ts         # User management
│   ├── courses.service.ts       # Course management
│   ├── enrollments.service.ts   # Enrollment validation
│   └── dashboard.service.ts     # Dashboard statistics
├── hooks/
│   ├── useAuth.ts               # Authentication hook
│   ├── useFiles.ts              # Files data hook
│   └── useAsync.ts              # Generic async operations hook
├── utils/
│   ├── dateFormatter.ts         # Date formatting utilities
│   ├── errorHandler.ts          # Error handling utilities
│   └── validators.ts            # Input validation
├── types.ts                     # Application types (updated)
└── App.tsx                      # Main app (updated)
```

## Components and Interfaces

### 1. Supabase Client Configuration

**File**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

**Environment Variables** (`.env`):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Types

**File**: `src/lib/types/database.ts`

Tipos TypeScript que refletem o schema do Supabase:

```typescript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          name: string;
          email: string;
          password_hash: string;
          role: 'admin' | 'student';
          course_id: number | null;
          course_name: string | null;
          avatar: string | null;
          matricula: string | null;
          created_at: string;
          updated_at: string;
          last_login: string | null;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      // ... outros tipos de tabelas
    };
    Functions: {
      authenticate_user: {
        Args: { p_email: string; p_password: string };
        Returns: Array<{
          id: number;
          name: string;
          email: string;
          role: string;
          course_name: string;
          avatar: string;
          matricula: string;
        }>;
      };
      // ... outras funções
    };
  };
}
```

### 3. Authentication Service

**File**: `src/services/auth.service.ts`

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student';
  course: string;
  avatar: string;
  matricula?: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthUser>
  async logout(): Promise<void>
  async updateProfile(userId: number, updates: Partial<AuthUser>): Promise<void>
  async changePassword(userId: number, newPassword: string): Promise<void>
}
```

**Key Operations**:
- Chama função `authenticate_user` do Supabase
- Converte dados do banco para formato da aplicação
- Gerencia erros de autenticação


### 4. Files Service

**File**: `src/services/files.service.ts`

```typescript
interface FileFilters {
  courseName?: string;
  semester?: string;
  subject?: string;
  authorId?: number;
  limit?: number;
  offset?: number;
}

interface CreateFileData {
  title: string;
  authorId: number;
  authorName: string;
  courseId: number;
  courseName: string;
  semester: string;
  subject: string;
  lastUpdateMessage: string;
  fileName?: string;
  fileType?: string;
  fileContent?: string;
  fileSize?: number;
}

class FilesService {
  async getFiles(filters: FileFilters): Promise<AcademicFile[]>
  async getFileById(id: number): Promise<AcademicFile>
  async createFile(data: CreateFileData): Promise<AcademicFile>
  async updateFile(id: number, updates: Partial<CreateFileData>): Promise<void>
  async deleteFile(id: number): Promise<void>
  async registerDownload(fileId: number, userId?: number): Promise<void>
}
```

**Key Operations**:
- Usa função `get_files_by_filters` para queries otimizadas
- Converte timestamps para formato "X dias atrás"
- Registra downloads com `register_file_download`

### 5. Dashboard Service

**File**: `src/services/dashboard.service.ts`

```typescript
interface DashboardStats {
  totalFiles: number;
  totalUsers: number;
  activeUsers: number;
  totalDownloads: number;
  pendingEnrollments: number;
  userFiles?: number;
  userDownloads?: number;
}

class DashboardService {
  async getAdminStats(): Promise<DashboardStats>
  async getStudentStats(userId: number): Promise<DashboardStats>
  async getRecentFiles(limit: number): Promise<AcademicFile[]>
  async getCourseFiles(courseName: string, limit: number): Promise<AcademicFile[]>
}
```

**Key Operations**:
- Chama função `get_dashboard_stats` do Supabase
- Diferencia estatísticas de admin vs student
- Usa view `recent_files` para performance

### 6. Enrollments Service

**File**: `src/services/enrollments.service.ts`

```typescript
interface EnrollmentData {
  studentName: string;
  email: string;
  matricula: string;
  courseId: number;
  courseName: string;
}

class EnrollmentsService {
  async getPendingEnrollments(): Promise<Enrollment[]>
  async validateEnrollment(enrollmentId: number, adminUserId: number): Promise<void>
  async rejectEnrollment(enrollmentId: number): Promise<void>
  async createEnrollment(data: EnrollmentData): Promise<Enrollment>
}
```

**Key Operations**:
- Chama funções `validate_enrollment` e `reject_enrollment`
- Filtra matrículas por status 'pending'
- Cria notificações automaticamente via trigger

### 7. Users Service

**File**: `src/services/users.service.ts`

```typescript
interface UserFilters {
  role?: 'admin' | 'student';
  courseId?: number;
  search?: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  courseId?: number;
  matricula?: string;
}

class UsersService {
  async getUsers(filters: UserFilters): Promise<User[]>
  async getUserById(id: number): Promise<User>
  async createUser(data: CreateUserData): Promise<User>
  async updateUser(id: number, updates: Partial<CreateUserData>): Promise<void>
  async deleteUser(id: number): Promise<void>
}
```

**Key Operations**:
- Hash de senhas feito no backend via bcrypt
- Avatar gerado automaticamente via trigger
- Validação de email e matrícula únicos

### 8. Courses Service

**File**: `src/services/courses.service.ts`

```typescript
interface CourseWithStats {
  id: number;
  name: string;
  description: string;
  studentCount: number;
  fileCount: number;
  totalDownloads: number;
}

class CoursesService {
  async getCourses(): Promise<Course[]>
  async getCoursesWithStats(): Promise<CourseWithStats[]>
  async getCourseById(id: number): Promise<Course>
  async createCourse(data: { name: string; description: string }): Promise<Course>
  async updateCourse(id: number, updates: Partial<Course>): Promise<void>
  async deleteCourse(id: number): Promise<void>
}
```

**Key Operations**:
- Usa view `course_statistics` para estatísticas
- Valida nome único antes de criar/atualizar
- Verifica dependências antes de deletar

## Data Models

### Updated Application Types

**File**: `src/types.ts`

```typescript
export enum Role {
  Admin = 'admin',
  Student = 'student',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  course: string; // course_name
  avatar: string;
  matricula?: string;
  lastLogin?: string;
}

export interface AcademicFile {
  id: number;
  title: string;
  author: string; // author_name
  authorId: number;
  course: string; // course_name
  courseId: number;
  downloads: number;
  uploadedAt: string; // formatted from created_at
  semester: string;
  subject: string;
  lastUpdateMessage: string;
  description?: string;
  fileName?: string;
  fileContent?: string;
  fileType?: string;
  fileSize?: number;
  createdAt: string; // ISO timestamp
}

export interface Enrollment {
  id: number;
  studentName: string;
  courseName: string;
  courseId: number;
  status: 'pending' | 'validated' | 'rejected';
  matricula: string;
  email: string;
  createdAt: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
}
```


## Error Handling

### Error Types

```typescript
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  SERVER = 'SERVER',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: unknown;
  userMessage: string; // Mensagem amigável para o usuário
}
```

### Error Handler Utility

**File**: `src/utils/errorHandler.ts`

```typescript
class ErrorHandler {
  static handle(error: unknown): AppError {
    // Identifica tipo de erro do Supabase
    // Retorna mensagem amigável em português
    // Loga erro para debugging
  }
  
  static getErrorMessage(error: AppError): string {
    // Retorna mensagem apropriada baseada no tipo
  }
}
```

**Error Messages** (Português):
- Network: "Erro de conexão. Verifique sua internet."
- Authentication: "Email ou senha incorretos."
- Authorization: "Você não tem permissão para esta ação."
- Validation: "Dados inválidos. Verifique os campos."
- Not Found: "Recurso não encontrado."
- Conflict: "Este email/matrícula já está em uso."
- Server: "Erro no servidor. Tente novamente."

## Testing Strategy

### Unit Tests

**Services**:
- Mock do Supabase client
- Testa transformação de dados
- Testa tratamento de erros
- Testa validações

**Utilities**:
- Date formatting
- Error handling
- Validators

### Integration Tests

**Fluxos Críticos**:
1. Login → Dashboard → Logout
2. Publicar arquivo → Visualizar → Download
3. Validar matrícula → Novo usuário criado
4. Criar curso → Associar usuário → Publicar arquivo

### E2E Tests (Opcional)

**Cenários de Usuário**:
- Admin valida matrícula e gerencia sistema
- Estudante publica arquivo e explora repositório

## Security Considerations

### 1. Authentication

- Senhas nunca enviadas em plain text
- Hash bcrypt no backend (gen_salt('bf'))
- Senha inicial de novos usuários = matrícula (deve ser alterada no primeiro login)
- Logout limpa todos os dados de sessão

### 2. Authorization

- RLS policies do Supabase aplicadas automaticamente
- Validação de role no frontend antes de renderizar UI
- Rotas protegidas por role (Admin vs Student)
- Usuários só podem editar/deletar próprios recursos

### 3. Input Validation

- Validação no frontend antes de enviar
- Validação no backend via constraints do PostgreSQL
- Sanitização de inputs para prevenir XSS
- Prepared statements para prevenir SQL injection

### 4. Data Protection

- Dados sensíveis (password_hash) nunca retornados em queries
- Email e matrícula validados como únicos
- Soft delete para auditoria (opcional)
- Logs de auditoria para ações críticas

## Performance Optimization

### 1. Database Queries

**Índices Utilizados**:
- `idx_files_course_semester_subject` para exploração
- `idx_files_created_at` para arquivos recentes
- `idx_files_author_id` para "Meus Arquivos"
- `idx_users_email` para login
- `idx_enrollments_status` para matrículas pendentes

**Views Otimizadas**:
- `recent_files`: Pré-calcula "uploadedAt" text
- `course_statistics`: Agrega estatísticas por curso
- `pending_enrollments`: Filtra e junta dados de matrículas

### 2. Frontend Optimization

**Caching**:
- Cursos cacheados (mudam raramente)
- Estatísticas do dashboard com TTL de 5 minutos
- Arquivos recentes cacheados por 1 minuto

**Lazy Loading**:
- Componentes de páginas carregados sob demanda
- Imagens e arquivos grandes carregados progressivamente

**Paginação**:
- Listagens limitadas a 50 itens por padrão
- Scroll infinito ou paginação tradicional
- Offset/limit para queries grandes

### 3. Network Optimization

**Request Batching**:
- Múltiplas queries combinadas quando possível
- Uso de `select` com joins para reduzir round-trips

**Debouncing**:
- Busca de arquivos com debounce de 300ms
- Filtros aplicados após usuário parar de digitar

## UX Considerations

### Loading States

```typescript
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}
```

**Implementação**:
- Skeleton loaders para listas
- Spinners para ações (botões)
- Progress bars para uploads
- Mensagens de "Carregando..." contextuais

### Success Feedback

- Toast notifications para ações bem-sucedidas
- Animações de confirmação (checkmark)
- Redirecionamento automático após sucesso
- Atualização otimista da UI quando apropriado

### Error Feedback

- Mensagens de erro inline em formulários
- Alertas destacados para erros críticos
- Sugestões de ação para resolver erros
- Botão "Tentar Novamente" para erros de rede

### Accessibility

- Labels descritivos em todos os campos
- Mensagens de erro associadas a campos (aria-describedby)
- Loading states anunciados para screen readers
- Navegação por teclado funcional

## Migration Strategy

### Phase 1: Setup & Core Services

1. Configurar Supabase client
2. Criar tipos do database
3. Implementar serviços básicos (auth, files, dashboard)
4. Criar hook useAsync para operações assíncronas

### Phase 2: Authentication & Dashboard

1. Atualizar LoginPage para usar authService
2. Atualizar Dashboard (Admin e Student) para usar dashboardService
3. Implementar loading states e error handling
4. Testar fluxo de login → dashboard → logout

### Phase 3: Core Features

1. Atualizar PublishFilePage para usar filesService
2. Atualizar ExplorePage para usar filesService com filtros
3. Atualizar MyFilesPage para filtrar por authorId
4. Implementar visualização e download de arquivos

### Phase 4: Admin Features

1. Atualizar ValidateEnrollmentsPage para usar enrollmentsService
2. Atualizar UserManagementPage para usar usersService
3. Atualizar AllCoursesPage para usar coursesService
4. Implementar gerenciamento completo de CRUD

### Phase 5: Polish & Testing

1. Implementar todas as mensagens de erro em português
2. Adicionar loading states em todas as operações
3. Implementar caching e otimizações
4. Testes de integração
5. Documentação de uso

## Deployment Considerations

### Environment Setup

**Development**:
```
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-anon-key
```

**Production**:
```
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-anon-key
```

### Database Setup

1. Executar `supabase-schema.sql` no SQL Editor
2. Verificar que todas as tabelas foram criadas
3. Verificar que RLS policies estão ativas
4. Testar funções do banco (authenticate_user, etc.)
5. Popular dados iniciais (cursos, admin user)

### Build & Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

### Monitoring

- Logs de erro no console do navegador
- Métricas do Supabase Dashboard
- Alertas para falhas de autenticação
- Monitoramento de performance de queries

## Future Enhancements

### Short Term

1. Upload de arquivos grandes para Supabase Storage
2. Sistema de notificações em tempo real
3. Busca full-text em arquivos
4. Exportação de relatórios (CSV, PDF)

### Long Term

1. Sistema de comentários em arquivos
2. Avaliações e reviews de arquivos
3. Tags e categorização avançada
4. Integração com sistemas acadêmicos externos
5. API pública para integrações

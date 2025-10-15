export enum Role {
  Admin,
  Student,
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  course: string;
  avatar: string; // Initials
  password?: string;
  matricula?: string;
}

export interface AcademicFile {
  id: number;
  title: string;
  author: string;
  course: string;
  downloads: number;
  uploadedAt: string; // e.g., "2 dias atrás"
  semester: string; // e.g., "2024.1"
  subject: string; // e.g., "Computação Gráfica"
  lastUpdateMessage: string;
  description?: string;
  fileName?: string;
  fileContent?: string;
  fileType?: string;
}

export interface Enrollment {
  id: number;
  studentName: string;
  courseName: string;
  status: 'pending' | 'validated';
  matricula: string;
  email: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
}

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
          email_blacklisted: boolean;
          sms_blacklisted: boolean;
          created_at: string;
          updated_at: string;
          last_login: string | null;
        };
        Insert: {
          name: string;
          email: string;
          password_hash: string;
          role: 'admin' | 'student';
          course_id?: number | null;
          course_name?: string | null;
          avatar?: string | null;
          matricula?: string | null;
          email_blacklisted?: boolean;
          sms_blacklisted?: boolean;
          last_login?: string | null;
        };
        Update: {
          name?: string;
          email?: string;
          password_hash?: string;
          role?: 'admin' | 'student';
          course_id?: number | null;
          course_name?: string | null;
          avatar?: string | null;
          matricula?: string | null;
          email_blacklisted?: boolean;
          sms_blacklisted?: boolean;
          last_login?: string | null;
        };
      };
      courses: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
        };
      };
      enrollments: {
        Row: {
          id: number;
          student_name: string;
          email: string;
          matricula: string;
          course_id: number;
          course_name: string;
          status: 'pending' | 'validated' | 'rejected';
          created_at: string;
          updated_at: string;
          validated_at: string | null;
          validated_by: number | null;
        };
        Insert: {
          student_name: string;
          email: string;
          matricula: string;
          course_id: number;
          course_name: string;
          status?: 'pending' | 'validated' | 'rejected';
          validated_at?: string | null;
          validated_by?: number | null;
        };
        Update: {
          student_name?: string;
          email?: string;
          matricula?: string;
          course_id?: number;
          course_name?: string;
          status?: 'pending' | 'validated' | 'rejected';
          validated_at?: string | null;
          validated_by?: number | null;
        };
      };
      academic_files: {
        Row: {
          id: number;
          title: string;
          author_id: number | null;
          author_name: string;
          course_id: number | null;
          course_name: string;
          semester: string;
          subject: string;
          description: string | null;
          last_update_message: string;
          downloads: number;
          file_name: string | null;
          file_type: string | null;
          file_content: string | null;
          file_url: string | null;
          file_size: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          author_id?: number | null;
          author_name: string;
          course_id?: number | null;
          course_name: string;
          semester: string;
          subject: string;
          description?: string | null;
          last_update_message: string;
          downloads?: number;
          file_name?: string | null;
          file_type?: string | null;
          file_content?: string | null;
          file_url?: string | null;
          file_size?: number | null;
        };
        Update: {
          title?: string;
          author_id?: number | null;
          author_name?: string;
          course_id?: number | null;
          course_name?: string;
          semester?: string;
          subject?: string;
          description?: string | null;
          last_update_message?: string;
          downloads?: number;
          file_name?: string | null;
          file_type?: string | null;
          file_content?: string | null;
          file_url?: string | null;
          file_size?: number | null;
        };
      };
      file_downloads: {
        Row: {
          id: number;
          file_id: number;
          user_id: number | null;
          downloaded_at: string;
          ip_address: string | null;
        };
        Insert: {
          file_id: number;
          user_id?: number | null;
          ip_address?: string | null;
        };
        Update: {
          file_id?: number;
          user_id?: number | null;
          downloaded_at?: string;
          ip_address?: string | null;
        };
      };
      system_settings: {
        Row: {
          id: number;
          key: string;
          value: string | null;
          description: string | null;
          updated_at: string;
          updated_by: number | null;
        };
        Insert: {
          key: string;
          value?: string | null;
          description?: string | null;
          updated_by?: number | null;
        };
        Update: {
          key?: string;
          value?: string | null;
          description?: string | null;
          updated_by?: number | null;
        };
      };
      notifications: {
        Row: {
          id: number;
          user_id: number;
          type: string;
          title: string;
          message: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          user_id: number;
          type: string;
          title: string;
          message?: string | null;
          read?: boolean;
        };
        Update: {
          user_id?: number;
          type?: string;
          title?: string;
          message?: string | null;
          read?: boolean;
        };
      };
      audit_log: {
        Row: {
          id: number;
          user_id: number | null;
          action: string;
          entity_type: string;
          entity_id: number | null;
          details: any | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          user_id?: number | null;
          action: string;
          entity_type: string;
          entity_id?: number | null;
          details?: any | null;
          ip_address?: string | null;
        };
        Update: {
          user_id?: number | null;
          action?: string;
          entity_type?: string;
          entity_id?: number | null;
          details?: any | null;
          ip_address?: string | null;
        };
      };
    };
    Views: {
      course_statistics: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          student_count: number;
          file_count: number;
          total_downloads: number;
        };
      };
      recent_files: {
        Row: {
          id: number;
          title: string;
          author_id: number | null;
          author_name: string;
          course_id: number | null;
          course_name: string;
          semester: string;
          subject: string;
          description: string | null;
          last_update_message: string;
          downloads: number;
          file_name: string | null;
          file_type: string | null;
          file_content: string | null;
          file_url: string | null;
          file_size: number | null;
          created_at: string;
          updated_at: string;
          author_email: string | null;
          course_full_name: string | null;
          uploaded_at_text: string | null;
        };
      };
      pending_enrollments: {
        Row: {
          id: number;
          student_name: string;
          email: string;
          matricula: string;
          course_id: number;
          course_name: string;
          status: 'pending' | 'validated' | 'rejected';
          created_at: string;
          updated_at: string;
          validated_at: string | null;
          validated_by: number | null;
          course_full_name: string | null;
          course_description: string | null;
        };
      };
    };
    Functions: {
      authenticate_user: {
        Args: {
          p_email: string;
          p_password: string;
        };
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
      validate_enrollment: {
        Args: {
          enrollment_id: number;
          admin_user_id: number;
        };
        Returns: boolean;
      };
      reject_enrollment: {
        Args: {
          enrollment_id: number;
        };
        Returns: boolean;
      };
      register_file_download: {
        Args: {
          p_file_id: number;
          p_user_id?: number;
          p_ip_address?: string;
        };
        Returns: boolean;
      };
      get_files_by_filters: {
        Args: {
          p_course_name?: string;
          p_semester?: string;
          p_subject?: string;
          p_limit?: number;
          p_offset?: number;
        };
        Returns: Array<{
          id: number;
          title: string;
          author_name: string;
          course_name: string;
          semester: string;
          subject: string;
          downloads: number;
          created_at: string;
          last_update_message: string;
        }>;
      };
      get_dashboard_stats: {
        Args: {
          p_user_id?: number;
        };
        Returns: Array<{
          total_files: number;
          total_users: number;
          active_users: number;
          total_downloads: number;
          pending_enrollments: number;
          user_files: number;
          user_downloads: number;
        }>;
      };
    };
  };
}

// Tipos auxiliares para facilitar o uso
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// Tipos específicos para cada tabela
export type User = TablesRow<'users'>;
export type UserInsert = TablesInsert<'users'>;
export type UserUpdate = TablesUpdate<'users'>;

export type Course = TablesRow<'courses'>;
export type CourseInsert = TablesInsert<'courses'>;
export type CourseUpdate = TablesUpdate<'courses'>;

export type Enrollment = TablesRow<'enrollments'>;
export type EnrollmentInsert = TablesInsert<'enrollments'>;
export type EnrollmentUpdate = TablesUpdate<'enrollments'>;

export type AcademicFile = TablesRow<'academic_files'>;
export type AcademicFileInsert = TablesInsert<'academic_files'>;
export type AcademicFileUpdate = TablesUpdate<'academic_files'>;

export type FileDownload = TablesRow<'file_downloads'>;
export type FileDownloadInsert = TablesInsert<'file_downloads'>;
export type FileDownloadUpdate = TablesUpdate<'file_downloads'>;

export type SystemSetting = TablesRow<'system_settings'>;
export type SystemSettingInsert = TablesInsert<'system_settings'>;
export type SystemSettingUpdate = TablesUpdate<'system_settings'>;

export type Notification = TablesRow<'notifications'>;
export type NotificationInsert = TablesInsert<'notifications'>;
export type NotificationUpdate = TablesUpdate<'notifications'>;

export type AuditLog = TablesRow<'audit_log'>;
export type AuditLogInsert = TablesInsert<'audit_log'>;
export type AuditLogUpdate = TablesUpdate<'audit_log'>;

// Tipos para Views
export type CourseStatistics = Database['public']['Views']['course_statistics']['Row'];
export type RecentFile = Database['public']['Views']['recent_files']['Row'];
export type PendingEnrollment = Database['public']['Views']['pending_enrollments']['Row'];

// Tipos para Functions
export type AuthenticateUserResult = Database['public']['Functions']['authenticate_user']['Returns'][0];
export type GetFilesByFiltersResult = Database['public']['Functions']['get_files_by_filters']['Returns'][0];
export type GetDashboardStatsResult = Database['public']['Functions']['get_dashboard_stats']['Returns'][0];
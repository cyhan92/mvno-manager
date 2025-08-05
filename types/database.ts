export interface DatabaseTask {
  id: string
  task_id: string
  title: string
  category?: string
  subcategory?: string
  detail?: string
  department?: string
  assignee?: string
  start_date?: string
  end_date?: string
  duration?: number
  progress: number
  status: '완료' | '진행중' | '미완료'
  cost?: string
  notes?: string
  major_category?: string
  middle_category?: string
  minor_category?: string
  created_at: string
  updated_at: string
}

export interface TaskHistory {
  id: string
  task_id: string
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  old_data?: any
  new_data?: any
  changed_by?: string
  created_at: string
}

// Supabase Database Schema
export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: DatabaseTask
        Insert: Omit<DatabaseTask, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseTask, 'id' | 'created_at' | 'updated_at'>>
      }
      task_history: {
        Row: TaskHistory
        Insert: Omit<TaskHistory, 'id' | 'created_at'>
        Update: Partial<Omit<TaskHistory, 'id' | 'created_at'>>
      }
    }
  }
}
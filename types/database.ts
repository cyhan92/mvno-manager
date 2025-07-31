export interface Task {
  id: string
  title: string
  category: string
  subcategory?: string
  detail?: string
  department?: string
  assignee?: string
  start_date?: string
  end_date?: string
  progress: number
  status: '완료' | '진행중' | '미완료'
  created_at: string
}
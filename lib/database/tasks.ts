import { supabase } from '../supabase'
import { DatabaseTask, Database } from '../../types/database'
import { ExcelTask } from '../excel/types'

/**
 * Excel Task를 Database Task로 변환
 */
export const transformExcelToDatabase = (excelTask: ExcelTask): Database['public']['Tables']['tasks']['Insert'] => {
  return {
    task_id: excelTask.id,
    title: excelTask.name,
    category: excelTask.category,
    subcategory: excelTask.subcategory,
    detail: excelTask.detail,
    department: excelTask.department,
    assignee: excelTask.resource,
    start_date: excelTask.start?.toISOString().split('T')[0],
    end_date: excelTask.end?.toISOString().split('T')[0],
    duration: excelTask.duration || undefined,
    progress: Math.round(excelTask.percentComplete || 0),
    status: excelTask.status as '완료' | '진행중' | '미완료',
    cost: typeof excelTask.cost === 'string' ? excelTask.cost : String(excelTask.cost || ''),
    notes: excelTask.notes,
    major_category: excelTask.majorCategory,
    middle_category: excelTask.middleCategory,
    minor_category: excelTask.minorCategory
  }
}

/**
 * Database Task를 Frontend Task로 변환
 */
export const transformDatabaseToTask = (dbTask: DatabaseTask): ExcelTask => {
  return {
    id: dbTask.task_id, // TASK-001, TASK-002 등
    dbId: dbTask.id, // 실제 DB의 UUID
    name: dbTask.title,
    resource: dbTask.assignee || 'N/A',
    start: dbTask.start_date ? new Date(dbTask.start_date) : new Date(),
    end: dbTask.end_date ? new Date(dbTask.end_date) : new Date(),
    duration: dbTask.duration || null,
    percentComplete: dbTask.progress,
    dependencies: null,
    category: dbTask.category || '미분류',
    subcategory: dbTask.subcategory,
    detail: dbTask.detail,
    department: dbTask.department,
    status: dbTask.status,
    cost: dbTask.cost,
    notes: dbTask.notes,
    majorCategory: dbTask.major_category,
    middleCategory: dbTask.middle_category,
    minorCategory: dbTask.minor_category
  }
}

/**
 * 모든 작업 조회
 */
export const getAllTasks = async (): Promise<ExcelTask[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`작업 조회 실패: ${error.message}`)
  }

  return data.map(transformDatabaseToTask)
}

/**
 * 작업 하나 조회
 */
export const getTaskById = async (taskId: string): Promise<ExcelTask | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('task_id', taskId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(`작업 조회 실패: ${error.message}`)
  }

  return transformDatabaseToTask(data)
}

/**
 * 작업 생성
 */
export const createTask = async (task: ExcelTask): Promise<DatabaseTask> => {
  const dbTask = transformExcelToDatabase(task)
  
  const { data, error } = await supabase
    .from('tasks')
    .insert(dbTask)
    .select()
    .single()

  if (error) {
    throw new Error(`작업 생성 실패: ${error.message}`)
  }

  return data
}

/**
 * 작업 업데이트
 */
export const updateTask = async (taskId: string, updates: Partial<ExcelTask>): Promise<DatabaseTask> => {
  const dbUpdates = transformExcelToDatabase({ id: taskId, ...updates } as ExcelTask)
  
  const { data, error } = await supabase
    .from('tasks')
    .update(dbUpdates)
    .eq('task_id', taskId)
    .select()
    .single()

  if (error) {
    throw new Error(`작업 업데이트 실패: ${error.message}`)
  }

  return data
}

/**
 * 작업 삭제
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('task_id', taskId)

  if (error) {
    throw new Error(`작업 삭제 실패: ${error.message}`)
  }
}

/**
 * 여러 작업을 한 번에 생성 (Excel 동기화용)
 */
export const bulkCreateTasks = async (tasks: ExcelTask[]): Promise<DatabaseTask[]> => {
  const dbTasks = tasks.map(transformExcelToDatabase)
  
  const { data, error } = await supabase
    .from('tasks')
    .insert(dbTasks)
    .select()

  if (error) {
    throw new Error(`일괄 작업 생성 실패: ${error.message}`)
  }

  return data
}

/**
 * 모든 작업 삭제 후 새로 생성 (Excel 전체 동기화용)
 */
export const syncTasksFromExcel = async (tasks: ExcelTask[]): Promise<DatabaseTask[]> => {
  // 트랜잭션으로 실행
  const { error: deleteError } = await supabase
    .from('tasks')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // 모든 행 삭제

  if (deleteError) {
    throw new Error(`기존 작업 삭제 실패: ${deleteError.message}`)
  }

  return await bulkCreateTasks(tasks)
}

/**
 * 작업 통계 조회
 */
export const getTaskStats = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('status, assignee, progress, start_date, end_date')

  if (error) {
    throw new Error(`통계 조회 실패: ${error.message}`)
  }

  const total = data.length
  const completed = data.filter(t => t.status === '완료').length
  const inProgress = data.filter(t => t.status === '진행중').length
  const notStarted = data.filter(t => t.status === '미완료').length
  
  const avgProgress = data.length > 0 
    ? Math.round(data.reduce((sum, t) => sum + t.progress, 0) / data.length)
    : 0

  return {
    total,
    completed,
    inProgress,
    notStarted,
    avgProgress,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}

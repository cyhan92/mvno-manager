import { Task, TaskStats } from '../../types/task'

/**
 * 작업 통계를 계산합니다
 */
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  // 안전한 배열 처리
  const safeTasks = Array.isArray(tasks) ? tasks : []
  
  const completed = safeTasks.filter(t => 
    t && typeof t.percentComplete === 'number' && t.percentComplete === 100
  ).length
  
  const inProgress = safeTasks.filter(t => 
    t && typeof t.percentComplete === 'number' && t.percentComplete > 0 && t.percentComplete < 100
  ).length
  
  const notStarted = safeTasks.filter(t => 
    t && (typeof t.percentComplete !== 'number' || t.percentComplete === 0)
  ).length
  
  const averageProgress = safeTasks.length > 0 
    ? safeTasks.reduce((sum, task) => {
        const progress = (task && typeof task.percentComplete === 'number') ? task.percentComplete : 0
        return sum + progress
      }, 0) / safeTasks.length 
    : 0

  return {
    total: safeTasks.length,
    completed,
    inProgress,
    notStarted,
    averageProgress: Math.round(averageProgress * 100) / 100 // 소수점 2자리로 반올림
  }
}

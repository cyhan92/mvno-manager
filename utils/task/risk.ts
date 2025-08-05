import { Task, RiskAnalysis } from '../../types/task'

/**
 * 위험도 분석을 수행합니다
 */
export const analyzeRisks = (tasks: Task[]): RiskAnalysis => {
  // 안전한 배열 처리
  const safeTasks = Array.isArray(tasks) ? tasks : []
  const today = new Date()
  
  const riskTasks = safeTasks.filter(task => {
    // task 객체와 필수 필드 검증
    if (!task || typeof task !== 'object') return false
    
    // 날짜 필드 검증
    const endDate = task.end instanceof Date ? task.end : new Date(task.end || Date.now())
    if (isNaN(endDate.getTime())) return false
    
    const percentComplete = typeof task.percentComplete === 'number' ? task.percentComplete : 0
    const daysUntilDeadline = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    return percentComplete < 50 && daysUntilDeadline <= 7 && daysUntilDeadline > 0
  })

  const delayedTasks = safeTasks.filter(task => {
    // task 객체와 필수 필드 검증
    if (!task || typeof task !== 'object') return false
    
    // 날짜 필드 검증
    const endDate = task.end instanceof Date ? task.end : new Date(task.end || Date.now())
    if (isNaN(endDate.getTime())) return false
    
    const percentComplete = typeof task.percentComplete === 'number' ? task.percentComplete : 0
    
    return endDate < today && percentComplete < 100
  })

  return { riskTasks, delayedTasks }
}

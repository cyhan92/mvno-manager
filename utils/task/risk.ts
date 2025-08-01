import { Task, RiskAnalysis } from '../../types/task'

/**
 * 위험도 분석을 수행합니다
 */
export const analyzeRisks = (tasks: Task[]): RiskAnalysis => {
  const today = new Date()
  
  const riskTasks = tasks.filter(task => {
    const daysUntilDeadline = Math.ceil((task.end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return task.percentComplete < 50 && daysUntilDeadline <= 7 && daysUntilDeadline > 0
  })

  const delayedTasks = tasks.filter(task => {
    return task.end < today && task.percentComplete < 100
  })

  return { riskTasks, delayedTasks }
}

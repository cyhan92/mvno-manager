import { Task, TaskStats, ResourceStats, RiskAnalysis } from '../../types/task'
import { 
  calculateTaskStats, 
  calculateResourceStats, 
  analyzeRisks 
} from '../../utils/task'

export const useTaskAnalytics = (tasks: Task[]) => {
  // 안전한 배열 확인
  const safeTasks = Array.isArray(tasks) ? tasks : []
  
  const stats: TaskStats = calculateTaskStats(safeTasks)
  const resourceStats: Record<string, ResourceStats> = calculateResourceStats(safeTasks)
  const riskAnalysis: RiskAnalysis = analyzeRisks(safeTasks)

  return { stats, resourceStats, riskAnalysis }
}

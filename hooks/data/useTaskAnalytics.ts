import { Task, TaskStats, ResourceStats, RiskAnalysis } from '../../types/task'
import { 
  calculateTaskStats, 
  calculateResourceStats, 
  analyzeRisks 
} from '../../utils/task'

export const useTaskAnalytics = (tasks: Task[]) => {
  const stats: TaskStats = calculateTaskStats(tasks)
  const resourceStats: Record<string, ResourceStats> = calculateResourceStats(tasks)
  const riskAnalysis: RiskAnalysis = analyzeRisks(tasks)

  return { stats, resourceStats, riskAnalysis }
}

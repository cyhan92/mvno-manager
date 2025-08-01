import { Task, TaskStats } from '../../types/task'

/**
 * 작업 통계를 계산합니다
 */
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const completed = tasks.filter(t => t.percentComplete === 100).length
  const inProgress = tasks.filter(t => t.percentComplete > 0 && t.percentComplete < 100).length
  const notStarted = tasks.filter(t => t.percentComplete === 0).length
  const averageProgress = tasks.length > 0 
    ? tasks.reduce((sum, task) => sum + task.percentComplete, 0) / tasks.length 
    : 0

  return {
    total: tasks.length,
    completed,
    inProgress,
    notStarted,
    averageProgress
  }
}

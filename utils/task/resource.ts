import { Task, ResourceStats } from '../../types/task'

/**
 * 담당자별 통계를 계산합니다
 */
export const calculateResourceStats = (tasks: Task[]): Record<string, ResourceStats> => {
  const stats = tasks.reduce((acc, task) => {
    const resource = task.resource || '미지정'
    if (!acc[resource]) {
      acc[resource] = { total: 0, completed: 0, progress: 0 }
    }
    acc[resource].total += 1
    if (task.percentComplete === 100) acc[resource].completed += 1
    acc[resource].progress += task.percentComplete
    return acc
  }, {} as Record<string, ResourceStats>)

  // 평균 진행률 계산
  Object.keys(stats).forEach(resource => {
    stats[resource].progress = stats[resource].progress / stats[resource].total
  })

  return stats
}

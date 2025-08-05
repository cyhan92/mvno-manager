import { Task, ResourceStats } from '../../types/task'

/**
 * 담당자별 통계를 계산합니다
 */
export const calculateResourceStats = (tasks: Task[]): Record<string, ResourceStats> => {
  // 안전한 배열 처리
  const safeTasks = Array.isArray(tasks) ? tasks : []
  
  const stats = safeTasks.reduce((acc, task) => {
    // task 객체와 필수 필드 검증
    if (!task || typeof task !== 'object') return acc
    
    const resource = (typeof task.resource === 'string' ? task.resource : null) || '미지정'
    const percentComplete = typeof task.percentComplete === 'number' ? task.percentComplete : 0
    
    if (!acc[resource]) {
      acc[resource] = { total: 0, completed: 0, progress: 0 }
    }
    
    acc[resource].total += 1
    if (percentComplete === 100) acc[resource].completed += 1
    acc[resource].progress += percentComplete
    
    return acc
  }, {} as Record<string, ResourceStats>)

  // 평균 진행률 계산
  Object.keys(stats).forEach(resource => {
    if (stats[resource].total > 0) {
      stats[resource].progress = Math.round((stats[resource].progress / stats[resource].total) * 100) / 100
    } else {
      stats[resource].progress = 0
    }
  })

  return stats
}

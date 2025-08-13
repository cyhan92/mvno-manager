import { Task, TaskStats } from '../../types/task'

/**
 * 작업 통계를 계산합니다
 * 상태값이 있으면 우선 사용하고, 없으면 완료율로 판단
 */
export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  // 안전한 배열 처리
  const safeTasks = Array.isArray(tasks) ? tasks : []
  
  const completed = safeTasks.filter(t => {
    if (!t) return false
    const byStatus = t.status === '완료'
    const byPercent = typeof t.percentComplete === 'number' && t.percentComplete === 100
    return byStatus || byPercent
  }).length
  
  const inProgress = safeTasks.filter(t => {
    if (!t) return false
    const byStatus = t.status === '진행중'
    const byPercent = typeof t.percentComplete === 'number' && t.percentComplete > 0 && t.percentComplete < 100
    return byStatus || byPercent
  }).length
  
  const notStarted = safeTasks.filter(t => {
    if (!t) return false
    const byStatus = t.status === '미진행' || t.status === '미완료'
    const byPercent = typeof t.percentComplete !== 'number' || t.percentComplete === 0
    // notStarted는 completed/inProgress에 해당하지 않는 나머지로도 계산될 수 있으나,
    // 여기서는 명시 조건(byStatus 또는 byPercent)을 만족하는 경우로 한정
    return byStatus || byPercent
  }).length
  
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

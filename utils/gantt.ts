import { Task, ViewMode } from '../types/task'

export const getStatusBadgeClass = (status?: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case '완료':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
    case 'in progress':
    case '진행중':
      return 'bg-blue-100 text-blue-800'
    case 'pending':
    case '대기':
      return 'bg-yellow-100 text-yellow-800'
    case 'blocked':
    case '차단됨':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const formatDate = (date: Date | string): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('ko-KR')
}

// 그룹 요약 데이터 생성
export const createGroupSummaryTasks = (
  groupedTasks: Record<string, Task[]>
): Task[] => {
  return Object.entries(groupedTasks)
    .map(([groupName, groupTasks]) => {
      if (groupTasks.length === 0) return null

      // 그룹의 시작일/종료일 계산
      const startDates = groupTasks.map(t => t.start.getTime())
      const endDates = groupTasks.map(t => t.end.getTime())
      const avgProgress = Number(
        (groupTasks.reduce((sum, t) => sum + t.percentComplete, 0) / groupTasks.length).toFixed(2)
      )

      // 그룹 상태 계산
      const completedTasks = groupTasks.filter(t => t.status === '완료').length
      const inProgressTasks = groupTasks.filter(t => t.status === '진행중').length
      const totalTasks = groupTasks.length
      
      let groupStatus = '미완료'
      if (completedTasks === totalTasks) {
        groupStatus = '완료'
      } else if (inProgressTasks > 0 || completedTasks > 0) {
        groupStatus = '진행중'
      }

      return {
        id: `GROUP_${groupName}`,
        name: `${groupName} (${groupTasks.length}개 작업)`,
        resource: `그룹: ${groupName}`,
        start: new Date(Math.min(...startDates)),
        end: new Date(Math.max(...endDates)),
        duration: null,
        percentComplete: avgProgress,
        dependencies: null,
        category: groupName,
        status: groupStatus,
        isGroup: true
      } as Task
    })
    .filter((task): task is Task => task !== null)
}

// 표시할 작업 데이터 계산
export const calculateDisplayTasks = (
  viewMode: ViewMode,
  tasks: Task[],
  groupBy?: string
): Task[] => {
  // 기본적으로 모든 작업을 반환
  return tasks
}

// 클릭된 행 인덱스 계산
export const calculateClickedRowIndex = (
  clickY: number,
  rect: DOMRect,
  topMargin: number,
  rowHeight: number
): number => {
  const relativeY = clickY - rect.top
  return Math.floor((relativeY - topMargin) / rowHeight)
}

// 작업 데이터 검증
export const validateTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(task => {
    return task.id && task.name && task.start && task.end
  })
}

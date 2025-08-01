import { Task } from '../../types/task'

/**
 * 작업 데이터를 API에서 가져와서 변환합니다
 */
export const fetchAndTransformTasks = async (): Promise<Task[]> => {
  const response = await fetch('/api/tasks')
  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }
  
  const data = await response.json()
  
  // 날짜 문자열을 Date 객체로 변환
  return data.map((task: any) => ({
    ...task,
    start: new Date(task.start),
    end: new Date(task.end),
    category: task.resource // 담당자를 카테고리로 사용
  }))
}

import { Task } from '../../types/task'

/**
 * 작업 데이터를 API에서 가져와서 변환합니다
 */
export const fetchAndTransformTasks = async (): Promise<Task[]> => {
  const response = await fetch('/api/tasks')
  if (!response.ok) {
    throw new Error('Failed to fetch tasks')
  }
  
  const result = await response.json()
  
  // ExcelParseResult에서 tasks 배열 추출
  if (!result.tasks || !Array.isArray(result.tasks)) {
    throw new Error('Invalid response format: tasks array not found')
  }
  
  // 날짜 문자열을 Date 객체로 변환
  return result.tasks.map((task: any) => ({
    ...task,
    start: new Date(task.start),
    end: new Date(task.end),
    category: task.resource // 담당자를 카테고리로 사용
  }))
}

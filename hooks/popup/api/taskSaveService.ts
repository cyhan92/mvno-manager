/**
 * 작업 저장 서비스
 */

import { Task } from '../../../types/task'
import { 
  TaskEditData, 
  isEditableTask, 
  transformTaskUpdateData, 
  transformApiResponseToTask, 
  updateTaskLocally 
} from './taskApiUtils'

export interface TaskSaveOptions {
  onTaskUpdate?: (updatedTask: Task) => void
  onDataRefresh?: () => Promise<void>
}

/**
 * 작업 저장 처리
 */
export const saveTaskService = async (
  task: Task, 
  editData: TaskEditData, 
  options: TaskSaveOptions
): Promise<void> => {
  const { onTaskUpdate, onDataRefresh } = options

  // 편집 가능한 작업인지 확인
  if (!isEditableTask(task)) {
    throw new Error('그룹 항목은 편집할 수 없습니다. 개별 작업만 편집 가능합니다.')
  }

  // DB ID가 없는 경우 로컬 업데이트만 수행
  if (!task.id) {
    console.warn('Task ID가 없는 작업입니다. 로컬 업데이트만 수행합니다:', task.id)
    
    if (onTaskUpdate) {
      const updatedTask = updateTaskLocally(task, editData)
      onTaskUpdate(updatedTask)
    }
    return
  }

  // API 요청 데이터 준비
  const updateData = transformTaskUpdateData(task, editData)
  console.log('Updating task:', task.id, 'with data:', updateData)

  // API 요청 수행
  const response = await fetch(`/api/tasks-db/${task.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to update task')
  }

  const result = await response.json()
  
  // DB 저장 성공 후 전체 데이터 다시 로드
  if (onDataRefresh) {
    await onDataRefresh()
  }
  
  // 로컬 업데이트도 수행 (즉시 반영용)
  if (onTaskUpdate && result.data) {
    const updatedTask = transformApiResponseToTask(task, result.data)
    onTaskUpdate(updatedTask)
  }
}

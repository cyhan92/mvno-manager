/**
 * 리팩토링된 작업 API 훅
 * 기존 useTaskApi.ts를 기능별로 분리하여 재구성
 */

import { useState } from 'react'
import { Task } from '../../types/task'
import { TaskEditData } from './api/taskApiUtils'
import { saveTaskService, TaskSaveOptions } from './api/taskSaveService'
import { deleteTaskService, TaskDeleteOptions } from './api/taskDeleteService'

interface UseTaskApiProps {
  onTaskUpdate?: (updatedTask: Task) => void
  onDataRefresh?: () => void
}

export const useTaskApiRefactored = ({ onTaskUpdate, onDataRefresh }: UseTaskApiProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const saveTask = async (task: Task, editData: TaskEditData) => {
    setIsLoading(true)
    try {
      const options: TaskSaveOptions = {
        onTaskUpdate,
        onDataRefresh: onDataRefresh ? async () => { await onDataRefresh() } : undefined
      }

      await saveTaskService(task, editData, options)
      
      // 성공 메시지 표시
      alert('작업이 성공적으로 저장되었습니다!')
      
    } catch (error) {
      console.error('Error updating task:', error)
      alert(`작업 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTask = async (task: Task, password: string, onTaskDelete?: (taskId: string) => void) => {
    setIsLoading(true)
    try {
      const options: TaskDeleteOptions = {
        onTaskDelete,
        onDataRefresh: onDataRefresh ? async () => { await onDataRefresh() } : undefined
      }

      await deleteTaskService(task, password, options)
      
      alert('작업이 성공적으로 삭제되었습니다.')
      
    } catch (error) {
      console.error('Error deleting task:', error)
      alert(`작업 삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    saveTask,
    deleteTask
  }
}

// 기존 호환성을 위한 별칭
export { useTaskApiRefactored as useTaskApi_refactored }

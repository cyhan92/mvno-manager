import { Task } from '../types/task'

export interface TaskUpdateData {
  startDate: string
  endDate: string
  percentComplete: number
  resource: string
  department: string
}

export class TaskApiService {
  static async updateTask(taskId: string, updateData: TaskUpdateData): Promise<Task> {
    try {
      const response = await fetch(`/api/tasks-db/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: updateData.startDate,
          end: updateData.endDate,
          percent_complete: updateData.percentComplete,
          resource: updateData.resource,
          department: updateData.department,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `서버 오류: ${response.status}`)
      }

      const updatedTask = await response.json()
      
      return {
        ...updatedTask,
        start: new Date(updatedTask.start),
        end: new Date(updatedTask.end),
        percentComplete: updatedTask.percent_complete
      }
    } catch (error) {
      console.error('작업 업데이트 오류:', error)
      throw error
    }
  }

  static async deleteTask(taskId: string, password: string): Promise<void> {
    try {
      // 먼저 비밀번호 검증
      const verifyResponse = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (!verifyResponse.ok) {
        if (verifyResponse.status === 401) {
          throw new Error('비밀번호가 일치하지 않습니다.')
        }
        throw new Error('비밀번호 검증 중 오류가 발생했습니다.')
      }

      // 비밀번호가 맞으면 작업 삭제
      const deleteResponse = await fetch(`/api/tasks-db/${taskId}`, {
        method: 'DELETE',
      })

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `삭제 중 오류가 발생했습니다: ${deleteResponse.status}`)
      }
    } catch (error) {
      console.error('작업 삭제 오류:', error)
      throw error
    }
  }
}

export const formatApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return '알 수 없는 오류가 발생했습니다.'
}

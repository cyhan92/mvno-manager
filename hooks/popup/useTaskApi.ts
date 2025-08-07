import { useState } from 'react'
import { Task } from '../../types/task'

interface TaskEditData {
  name: string
  startDate: string
  endDate: string
  percentComplete: number
  resource: string
  department: string
}

interface UseTaskApiProps {
  onTaskUpdate?: (updatedTask: Task) => void
  onDataRefresh?: () => void
}

export const useTaskApi = ({ onTaskUpdate, onDataRefresh }: UseTaskApiProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const saveTask = async (task: Task, editData: TaskEditData) => {
    setIsLoading(true)
    try {
      // 편집 가능한 작업인지 확인
      const isEditableTask = task.level === 2 || (!task.isGroup && !task.hasChildren)
      
      if (!isEditableTask) {
        throw new Error('그룹 항목은 편집할 수 없습니다. 개별 작업만 편집 가능합니다.')
      }

      // DB ID가 없는 경우 경고하지만 로컬 업데이트는 시도
      if (!task.id) {
        console.warn('Task ID가 없는 작업입니다. 로컬 업데이트만 수행합니다:', task.id)
        
        // 로컬 상태만 업데이트
        if (onTaskUpdate) {
          const updatedTask = {
            ...task,
            name: editData.name,
            start: editData.startDate ? new Date(editData.startDate) : task.start,
            end: editData.endDate ? new Date(editData.endDate) : task.end,
            percentComplete: editData.percentComplete,
            resource: editData.resource,
            department: editData.department
          }
          onTaskUpdate(updatedTask)
        }
        
        return
      }

      const updateData = {
        name: editData.name,
        start: editData.startDate ? new Date(editData.startDate).toISOString() : task.start.toISOString(),
        end: editData.endDate ? new Date(editData.endDate).toISOString() : task.end.toISOString(),
        percent_complete: editData.percentComplete,
        resource: editData.resource,
        department: editData.department
      }

      console.log('Updating task:', task.id, 'with data:', updateData)

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
        await onDataRefresh() // await를 추가하여 완전히 완료될 때까지 대기
      }
      
      // 로컬 업데이트도 수행 (즉시 반영용)
      if (onTaskUpdate && result.data) {
        const updatedTask = {
          ...task,
          name: result.data.title || result.data.name || editData.name,
          start: new Date(result.data.start_date),
          end: new Date(result.data.end_date),
          percentComplete: result.data.progress,
          resource: result.data.assignee,
          department: result.data.department
        }
        onTaskUpdate(updatedTask)
      }

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
      // 서버 연결 확인을 위한 간단한 헬스체크
      try {
        const healthCheck = await fetch('/api/tasks-db', { 
          method: 'HEAD',
          cache: 'no-cache'
        })
        if (!healthCheck.ok) {
          throw new Error('서버에 연결할 수 없습니다.')
        }
      } catch (networkError) {
        throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.')
      }

      // 패스워드 검증 API 호출
      let authResponse: Response
      try {
        authResponse = await fetch('/api/auth/verify-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        })
      } catch (networkError) {
        throw new Error('비밀번호 검증 중 네트워크 오류가 발생했습니다.')
      }

      if (!authResponse.ok) {
        const authError = await authResponse.json()
        throw new Error(authError.error || '비밀번호가 일치하지 않습니다.')
      }

      // 작업 삭제 API 호출 (dbId 우선 사용)
      let deleteResponse: Response
      try {
        const apiUrl = task.dbId ? `/api/tasks-db/${task.dbId}` : `/api/tasks-db/${task.id}`
        deleteResponse = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (networkError) {
        throw new Error('작업 삭제 중 네트워크 오류가 발생했습니다.')
      }

      if (!deleteResponse.ok) {
        const deleteError = await deleteResponse.json()
        throw new Error(deleteError.error || '작업 삭제에 실패했습니다.')
      }

      // 성공 시 콜백 호출
      if (onTaskDelete) {
        onTaskDelete(task.id)
      }

      // 전체 데이터 새로고침
      if (onDataRefresh) {
        await onDataRefresh()
      }

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

/**
 * 작업 삭제 서비스
 */

import { Task } from '../../../types/task'

export interface TaskDeleteOptions {
  onTaskDelete?: (taskId: string) => void
  onDataRefresh?: () => Promise<void>
}

/**
 * 서버 연결 상태 확인
 */
const checkServerConnection = async (): Promise<void> => {
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
}

/**
 * 비밀번호 검증
 */
const verifyPassword = async (password: string): Promise<void> => {
  try {
    const authResponse = await fetch('/api/auth/verify-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })

    if (!authResponse.ok) {
      const authError = await authResponse.json()
      throw new Error(authError.error || '비밀번호가 일치하지 않습니다.')
    }
  } catch (networkError) {
    if (networkError instanceof Error && networkError.message.includes('비밀번호')) {
      throw networkError
    }
    throw new Error('비밀번호 검증 중 네트워크 오류가 발생했습니다.')
  }
}

/**
 * 작업 삭제 API 호출
 */
const deleteTaskFromApi = async (task: Task): Promise<void> => {
  try {
    const apiUrl = task.dbId ? `/api/tasks-db/${task.dbId}` : `/api/tasks-db/${task.id}`
    const deleteResponse = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!deleteResponse.ok) {
      const deleteError = await deleteResponse.json()
      throw new Error(deleteError.error || '작업 삭제에 실패했습니다.')
    }
  } catch (networkError) {
    if (networkError instanceof Error && networkError.message.includes('삭제에 실패')) {
      throw networkError
    }
    throw new Error('작업 삭제 중 네트워크 오류가 발생했습니다.')
  }
}

/**
 * 작업 삭제 처리
 */
export const deleteTaskService = async (
  task: Task, 
  password: string, 
  options: TaskDeleteOptions
): Promise<void> => {
  const { onTaskDelete, onDataRefresh } = options

  // 서버 연결 확인
  await checkServerConnection()

  // 비밀번호 검증
  await verifyPassword(password)

  // 작업 삭제
  await deleteTaskFromApi(task)

  // 성공 시 콜백 호출
  if (onTaskDelete) {
    onTaskDelete(task.id)
  }

  // 전체 데이터 새로고침
  if (onDataRefresh) {
    await onDataRefresh()
  }
}

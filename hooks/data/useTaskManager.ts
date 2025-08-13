import { useState, useCallback } from 'react'
import { Task } from '../../types/task'

interface UseTaskManagerProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  refetch?: () => void
  onTaskAction?: (action: 'add' | 'delete' | 'update') => void
}

export const useTaskManager = ({ tasks, setTasks, refetch, onTaskAction }: UseTaskManagerProps) => {
  const [isLoading, setIsLoading] = useState(false)

  // Task 추가 핸들러
  const handleTaskAdd = useCallback(async (newTask: Partial<Task>) => {
    setIsLoading(true)
    try {
      // Task ID 결정: 전달받은 ID가 있으면 사용, 없으면 새로 생성
      let taskId = newTask.id
      if (!taskId) {
        // 새로운 Task ID 생성 (기존 Task 중 가장 큰 번호 + 1)
        const existingIds = tasks.map(task => {
          const match = task.id.match(/TASK-(\\d+)/)
          return match ? parseInt(match[1], 10) : 0
        })
        const nextId = Math.max(...existingIds, 0) + 1
        taskId = `TASK-${String(nextId).padStart(3, '0')}`
      }
      
      // 새로운 Task 객체 생성
      const taskToAdd: Task = {
        id: taskId,
        name: newTask.name || '새로운 업무', // UI 표시용
        title: newTask.name || newTask.title || '새로운 업무', // DB 저장용 (현재는 name과 동일)
        resource: newTask.resource || '미정',
        start: newTask.start || new Date(),
        end: newTask.end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 기본 7일 후
        duration: newTask.duration || 7,
        percentComplete: newTask.percentComplete || 0,
        dependencies: newTask.dependencies || null,
        category: newTask.category || '',
        subcategory: newTask.subcategory || '',
        detail: newTask.detail || '', // 빈 문자열 유지 (기본값 추가하지 않음)
        department: newTask.department || '미정',
        status: (newTask.status === '완료' || newTask.status === '진행중' || newTask.status === '미완료') 
          ? newTask.status 
          : '미완료', // 기본값을 '미완료'로 설정
        cost: newTask.cost || '',
        notes: newTask.notes || '',
        majorCategory: newTask.majorCategory || '',
        middleCategory: newTask.middleCategory || '',
        minorCategory: newTask.minorCategory || '',
        level: newTask.level || 2, // 기본적으로 세부업무로 설정
        parentId: newTask.parentId || '',
        hasChildren: false,
        isGroup: false
      }
      
      // API 호출하여 DB에 저장 (Task 객체를 그대로 전송)
      const response = await fetch('/api/tasks-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToAdd),
      })

      if (!response.ok) {
        throw new Error('Task 생성에 실패했습니다.')
      }

      const result = await response.json()
      console.log('Task 생성 성공:', result)

      // 로컬 상태에 새 Task 추가 (전체 리로드 없이)
      if (result.task) {
        // API 응답에서 받은 날짜 문자열을 Date 객체로 변환
        const taskWithDateObjects = {
          ...result.task,
          start: new Date(result.task.start),
          end: new Date(result.task.end)
        }
        
        const newTasks = [...tasks, taskWithDateObjects]
        setTasks(newTasks)
        
        // 상위 컴포넌트에 추가 알림
        onTaskAction?.('add')
        
      } else {
        // result.task가 없는 경우 fallback으로 refetch 사용
        console.warn('⚠️ API 응답에 task 정보가 없어 데이터 재로드')
        if (refetch) {
          await refetch()
        }
      }

      // 성공 - 별도의 팝업 없이 조용히 처리

    } catch (error) {
      console.error('Task 추가 중 오류:', error)
      alert(`업무 추가 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsLoading(false)
    }
  }, [tasks, setTasks, refetch, onTaskAction])

  // Task 업데이트 핸들러
  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
    
    // 상위 컴포넌트에 업데이트 알림
    onTaskAction?.('update')
  }, [tasks, setTasks, onTaskAction])

  // Task 삭제 핸들러
  const handleTaskDelete = useCallback(async (taskId: string) => {
    setIsLoading(true)
    try {
      console.log('🗑️ 삭제 요청 시작:', taskId)

      // API 호출하여 DB에서 삭제
      const response = await fetch('/api/tasks-db', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ 삭제 API 오류 응답:', errorData)
        throw new Error(errorData.error || `삭제 실패: ${response.status}`)
      }

      const result = await response.json()

      // 로컬 상태에서 해당 Task 제거 (전체 리로드 없이)
      const updatedTasks = tasks.filter(task => task.id !== taskId)
      setTasks(updatedTasks)
      
      // 상위 컴포넌트에 삭제 알림
      onTaskAction?.('delete')
      
      // 성공 - 별도의 팝업 없이 조용히 처리

    } catch (error) {
      console.error('❌ Task 삭제 중 오류:', error)
      alert(`업무 삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsLoading(false)
    }
  }, [tasks, setTasks, onTaskAction])

  // 대분류 수정 핸들러
  const handleMajorCategoryUpdate = useCallback(async (oldCategory: string, newCategory: string) => {
    setIsLoading(true)
    try {

      // API 호출하여 대분류 일괄 수정
      const response = await fetch('/api/major-category', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldCategory,
          newCategory
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ [클라이언트] API 오류 응답:', errorData)
        throw new Error(errorData.error || `서버 오류: ${response.status}`)
      }

      const result = await response.json()

      // 1) 로컬 상태 즉시 업데이트 (동기 UI 반영)
      // 기존 대분류명이 oldCategory인 모든 Task의 majorCategory를 newCategory로 교체
      // 트리(대분류/소분류) 표시가 tasks 기반으로 다시 계산되므로 즉시 Action Items에 반영됨
      const locallyUpdatedTasks = tasks.map((t: Task) =>
        (t.majorCategory || '') === (oldCategory || '')
          ? { ...t, majorCategory: newCategory }
          : t
      )
      setTasks(locallyUpdatedTasks)

      // 액션 타입 알림 (데이터 동기화를 위해)
      if (onTaskAction) {
        onTaskAction('update')
      }

      // 2) 전체 데이터 다시 로드 (DB와 최종 동기화)
      if (refetch) {
        await refetch()
      } else {
        console.warn('⚠️ [클라이언트] refetch 함수가 없습니다')
      }

    } catch (error) {
      console.error('❌ [클라이언트] 대분류 수정 중 오류:', error)
      throw error // 에러를 상위로 전달하여 팝업에서 처리하도록 함
    } finally {
      setIsLoading(false)
    }
  }, [refetch, onTaskAction])

  // 중분류,소분류 수정 핸들러
  const handleSubCategoryUpdate = useCallback(async (taskId: string, middleCategory: string, subCategory: string, currentMiddleCategory?: string, currentSubCategory?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/sub-category', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          middleCategory,
          subCategory,
          currentMiddleCategory,
          currentSubCategory
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '중분류,소분류 수정에 실패했습니다.')
      }

      const result = await response.json()

      // 로컬 상태에서 해당 Task들 업데이트
      const updatedTasks = tasks.map((task: Task) => {
        let shouldUpdate = false
        let updateReason = ''
        
        // 항상 중분류+소분류 조합으로 업데이트 (특정 소분류의 task만 수정)
        if (currentMiddleCategory && currentSubCategory &&
            task.middleCategory === currentMiddleCategory && 
            task.minorCategory === currentSubCategory) {
          shouldUpdate = true
          updateReason = '중분류+소분류 수정'
        }
        
        if (shouldUpdate) {
          return {
            ...task,
            middleCategory,
            minorCategory: subCategory // 소분류도 함께 업데이트 (같은 값일 수도 있음)
          }
        }
        
        return task
      })
      
      setTasks(updatedTasks)
      
      // 상위 컴포넌트에 업데이트 알림
      onTaskAction?.('update')

    } catch (error) {
      console.error('중분류,소분류 수정 중 오류:', error)
      throw error // 에러를 상위로 전달하여 팝업에서 처리하도록 함
    } finally {
      setIsLoading(false)
    }
  }, [tasks, setTasks, onTaskAction])

  // 대분류 이동 핸들러
  const handleMoveMajorCategory = useCallback(async (currentMajorCategory: string, currentMinorCategory: string, targetMajorCategory: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/move-major-category', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentMajorCategory,
          currentMinorCategory,
          targetMajorCategory
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      // 로컬 상태 업데이트
      const updatedTasks = tasks.map((task: Task) => {
        if (task.majorCategory === currentMajorCategory && task.minorCategory === currentMinorCategory) {
          return {
            ...task,
            majorCategory: targetMajorCategory
          }
        }
        return task
      })

      setTasks(updatedTasks)

      // 부모 컴포넌트에 변경 알림
      onTaskAction?.('update')

      // 전체 데이터 다시 로드 (DB와 동기화)
      if (refetch) {
        await refetch()
      } else {
        console.warn('⚠️ [대분류 이동] refetch 함수가 없습니다')
      }

      return {
        success: true,
        updatedCount: result.data.updatedCount
      }

    } catch (error) {
      console.error('❌ 대분류 이동 실패:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [tasks, setTasks, onTaskAction])

  return {
    isLoading,
    handleTaskAdd,
    handleTaskUpdate,
    handleTaskDelete,
    handleMajorCategoryUpdate,
    handleSubCategoryUpdate,
    handleMoveMajorCategory
  }
}

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
        name: newTask.name || '새로운 업무',
        resource: newTask.resource || '미정',
        start: newTask.start || new Date(),
        end: newTask.end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 기본 7일 후
        duration: newTask.duration || 7,
        percentComplete: newTask.percentComplete || 0,
        dependencies: newTask.dependencies || null,
        category: newTask.category || '',
        subcategory: newTask.subcategory || '',
        detail: newTask.detail || '',
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
        
        console.log('✅ 로컬 상태에 새 Task 추가 (리프레시 없음)', {
          newTaskId: taskWithDateObjects.id,
          newTaskName: taskWithDateObjects.name,
          startDate: taskWithDateObjects.start,
          endDate: taskWithDateObjects.end,
          totalTasks: newTasks.length
        })
      } else {
        // result.task가 없는 경우 fallback으로 refetch 사용
        console.warn('⚠️ API 응답에 task 정보가 없어 데이터 재로드')
        if (refetch) {
          await refetch()
        }
      }

      // 성공 - 별도의 팝업 없이 조용히 처리
      console.log('새로운 업무가 성공적으로 추가되었습니다!')

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
      console.log('✅ 삭제 API 성공:', result)

      // 로컬 상태에서 해당 Task 제거 (전체 리로드 없이)
      const updatedTasks = tasks.filter(task => task.id !== taskId)
      setTasks(updatedTasks)
      
      // 상위 컴포넌트에 삭제 알림
      onTaskAction?.('delete')
      
      console.log('✅ 로컬 상태에서 Task 삭제 완료 (리프레시 없음)', {
        deletedTaskId: taskId,
        remainingTasks: updatedTasks.length
      })

      // 성공 - 별도의 팝업 없이 조용히 처리
      console.log('업무가 성공적으로 삭제되었습니다!')

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
      console.log(`🔄 대분류 수정 요청 시작: "${oldCategory}" → "${newCategory}"`)

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

      console.log('📡 API 응답 상태:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ API 오류 응답:', errorData)
        throw new Error(errorData.error || `서버 오류: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ 대분류 수정 API 성공:', result)

      // 전체 데이터 다시 로드
      if (refetch) {
        console.log('🔄 데이터 재로드 시작...')
        await refetch()
        console.log('✅ 데이터 재로드 완료')
      } else {
        console.warn('⚠️ refetch 함수가 없습니다')
      }

    } catch (error) {
      console.error('대분류 수정 중 오류:', error)
      throw error // 에러를 상위로 전달하여 팝업에서 처리하도록 함
    } finally {
      setIsLoading(false)
    }
  }, [refetch])

  // 중분류,소분류 수정 핸들러
  const handleSubCategoryUpdate = useCallback(async (taskId: string, middleCategory: string, subCategory: string, currentMiddleCategory?: string, currentSubCategory?: string) => {
    setIsLoading(true)
    try {
      console.log('🎯 중분류,소분류 수정 요청:', { taskId, middleCategory, subCategory, currentMiddleCategory, currentSubCategory })
      
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
      console.log('✅ 중분류,소분류 수정 성공:', result)

      // API 응답에서 실제 업데이트된 Task ID들 가져오기
      const updatedTaskIds = result.updatedTasks?.map((t: any) => t.task_id) || []
      console.log('🔄 업데이트된 Task ID들:', updatedTaskIds)

      // 로컬 상태에서 해당 Task들 업데이트 (전체 리로드 없이)
      const updatedTasks = tasks.map((task: Task) => {
        // API에서 실제로 업데이트된 Task들만 로컬에서도 업데이트
        if (updatedTaskIds.includes(task.id)) {
          // Task 이름 업데이트: "[중분류] 소분류" 형식으로 변경
          const newName = `[${middleCategory}] ${subCategory}`
          console.log(`🎯 Task ${task.id} 업데이트:`, {
            oldName: task.name,
            newName,
            oldMiddle: task.middleCategory,
            newMiddle: middleCategory,
            oldMinor: task.minorCategory,
            newMinor: subCategory
          })
          return {
            ...task,
            name: newName,
            middleCategory,
            minorCategory: subCategory
          }
        }
        return task
      })
      
      setTasks(updatedTasks)
      
      // 상위 컴포넌트에 업데이트 알림
      onTaskAction?.('update')

      console.log('✅ 로컬 상태 업데이트 완료 (리프레시 없음)', { 
        updatedCount: updatedTaskIds.length,
        totalTasks: tasks.length 
      })

    } catch (error) {
      console.error('중분류,소분류 수정 중 오류:', error)
      throw error // 에러를 상위로 전달하여 팝업에서 처리하도록 함
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
    handleSubCategoryUpdate
  }
}

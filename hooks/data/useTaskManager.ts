import { useState, useCallback } from 'react'
import { Task } from '../../types/task'

interface UseTaskManagerProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  refetch?: () => void
}

export const useTaskManager = ({ tasks, setTasks, refetch }: UseTaskManagerProps) => {
  const [isLoading, setIsLoading] = useState(false)

  // Task 추가 핸들러
  const handleTaskAdd = useCallback(async (newTask: Partial<Task>) => {
    setIsLoading(true)
    try {
      // 새로운 Task ID 생성 (기존 Task 중 가장 큰 번호 + 1)
      const existingIds = tasks.map(task => {
        const match = task.id.match(/TASK-(\\d+)/)
        return match ? parseInt(match[1], 10) : 0
      })
      const nextId = Math.max(...existingIds, 0) + 1
      const taskId = `TASK-${String(nextId).padStart(3, '0')}`
      
      // 새로운 Task 객체 생성
      const taskToAdd: Task = {
        id: taskId,
        name: newTask.name || '새로운 업무',
        resource: newTask.resource || '',
        start: newTask.start || new Date(),
        end: newTask.end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 기본 7일 후
        duration: newTask.duration || 7,
        percentComplete: newTask.percentComplete || 0,
        dependencies: newTask.dependencies || null,
        category: newTask.category || '',
        subcategory: newTask.subcategory || '',
        detail: newTask.detail || '',
        department: newTask.department || '',
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
      
      // API 호출하여 DB에 저장
      const response = await fetch('/api/tasks-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskToAdd.name,
          start_date: taskToAdd.start.toISOString(),
          end_date: taskToAdd.end.toISOString(),
          progress: taskToAdd.percentComplete,
          assignee: taskToAdd.resource,
          department: taskToAdd.department,
          status: taskToAdd.status,
          major_category: taskToAdd.majorCategory,
          middle_category: taskToAdd.middleCategory,
          minor_category: taskToAdd.minorCategory,
          level: taskToAdd.level,
          parent_id: taskToAdd.parentId
        }),
      })

      if (!response.ok) {
        throw new Error('Task 생성에 실패했습니다.')
      }

      const result = await response.json()
      console.log('Task 생성 성공:', result)

      // 전체 데이터 다시 로드
      if (refetch) {
        await refetch()
      }

      alert('새로운 업무가 성공적으로 추가되었습니다!')

    } catch (error) {
      console.error('Task 추가 중 오류:', error)
      alert(`업무 추가 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsLoading(false)
    }
  }, [tasks, refetch])

  // Task 업데이트 핸들러
  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }, [tasks, setTasks])

  // Task 삭제 핸들러
  const handleTaskDelete = useCallback((taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }, [tasks, setTasks])

  return {
    isLoading,
    handleTaskAdd,
    handleTaskUpdate,
    handleTaskDelete
  }
}

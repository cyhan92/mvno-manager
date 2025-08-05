import { useState, useEffect, useCallback } from 'react'
import { Task } from '../../types/task'

export const useTasksFromDatabase = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'database' | 'excel_fallback' | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/tasks-db')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      // 응답 데이터 타입 검증
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format')
      }
      
      if (result.success) {
        // tasks 배열 타입 검증
        const tasks = Array.isArray(result.tasks) ? result.tasks : []
        
        // 각 task 객체의 필수 필드 검증 및 타입 변환
        const validTasks = tasks.filter((task: any) => {
          return task && 
                 typeof task === 'object' && 
                 typeof task.id === 'string' && 
                 typeof task.name === 'string'
        }).map((task: any): Task => {
          // 날짜 필드를 Date 객체로 변환
          const parseDate = (dateValue: any): Date => {
            if (dateValue instanceof Date) {
              return dateValue
            }
            if (typeof dateValue === 'string') {
              const parsed = new Date(dateValue)
              return isNaN(parsed.getTime()) ? new Date() : parsed
            }
            return new Date()
          }

          return {
            id: String(task.id),
            name: String(task.name),
            resource: String(task.resource || ''),
            start: parseDate(task.start),
            end: parseDate(task.end),
            duration: typeof task.duration === 'number' ? task.duration : null,
            percentComplete: typeof task.percentComplete === 'number' ? task.percentComplete : 0,
            dependencies: task.dependencies ? String(task.dependencies) : null,
            category: task.category ? String(task.category) : undefined,
            subcategory: task.subcategory ? String(task.subcategory) : undefined,
            detail: task.detail ? String(task.detail) : undefined,
            department: task.department ? String(task.department) : undefined,
            status: task.status ? String(task.status) : undefined,
            cost: task.cost !== undefined ? task.cost : undefined,
            notes: task.notes ? String(task.notes) : undefined,
            majorCategory: task.majorCategory ? String(task.majorCategory) : undefined,
            middleCategory: task.middleCategory ? String(task.middleCategory) : undefined,
            minorCategory: task.minorCategory ? String(task.minorCategory) : undefined,
            isGroup: Boolean(task.isGroup),
            level: typeof task.level === 'number' ? task.level : undefined,
            parentId: task.parentId ? String(task.parentId) : undefined,
            hasChildren: Boolean(task.hasChildren)
          }
        })
        
        setTasks(validTasks)
        setSource(result.source || 'database')
        
        if (result.warning) {
          console.warn('⚠️', result.warning)
        }
        
        if (validTasks.length !== tasks.length) {
          console.warn(`⚠️ ${tasks.length - validTasks.length}개의 유효하지 않은 태스크가 필터링되었습니다.`)
        }
      } else {
        throw new Error(result.message || 'Failed to fetch tasks from database')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching tasks from database:', err)
      
      // 오류 발생 시 빈 배열로 초기화하여 UI 렌더링 오류 방지
      setTasks([])
      setSource(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // 클라이언트 사이드에서만 실행하고, 컴포넌트가 마운트된 상태에서만 실행
    if (typeof window !== 'undefined') {
      let isMounted = true
      
      const executeFetch = async () => {
        try {
          await fetchTasks()
        } catch (error) {
          if (isMounted) {
            console.error('useEffect에서 fetchTasks 실행 중 오류:', error)
          }
        }
      }
      
      executeFetch()
      
      // 컴포넌트 언마운트 시 플래그 설정
      return () => {
        isMounted = false
      }
    }
  }, [fetchTasks])

  return { 
    tasks, 
    loading, 
    error, 
    source,
    refetch: fetchTasks 
  }
}

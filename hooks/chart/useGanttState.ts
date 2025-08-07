import { useState, useMemo, useRef } from 'react'
import { Task, ViewMode, DateUnit } from '../../types/task'

interface UseGanttStateProps {
  tasks: Task[]
  viewMode: ViewMode
  dateUnit: DateUnit
}

export const useGanttState = ({ tasks, viewMode, dateUnit }: UseGanttStateProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const lastRenderTimeRef = useRef<number>(0)

  // 실제 렌더링할 데이터 계산
  const displayTasks = useMemo(() => {
    return tasks
  }, [tasks])

  // displayTasks의 안정적인 키 생성
  const tasksKey = useMemo(() => {
    return `${displayTasks.length}-${dateUnit}-${viewMode}`
  }, [displayTasks.length, dateUnit, viewMode])

  const updateLoadingState = (loading: boolean) => {
    setIsLoading(loading)
  }

  const shouldThrottleRender = () => {
    const now = Date.now()
    if (now - lastRenderTimeRef.current < 50) {
      return true
    }
    lastRenderTimeRef.current = now
    return false
  }

  return {
    displayTasks,
    tasksKey,
    isLoading,
    updateLoadingState,
    shouldThrottleRender
  }
}

import { useState, useRef, useCallback } from 'react'

export const useGanttRenderTrigger = () => {
  const [renderTrigger, setRenderTrigger] = useState(0)
  const renderTriggerRef = useRef<NodeJS.Timeout | null>(null)

  // 디바운싱된 렌더 트리거 함수
  const triggerRender = useCallback(() => {
    if (renderTriggerRef.current) {
      clearTimeout(renderTriggerRef.current)
    }
    
    renderTriggerRef.current = setTimeout(() => {
      setRenderTrigger(prev => prev + 1)
    }, 100) // 100ms 디바운싱
  }, [])

  return {
    renderTrigger,
    triggerRender
  }
}

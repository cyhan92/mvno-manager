import { useState, useCallback, useRef } from 'react'

export const useRenderTrigger = () => {
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

  // 즉시 렌더 트리거 (디바운싱 없음)
  const triggerRenderImmediate = useCallback(() => {
    setRenderTrigger(prev => prev + 1)
  }, [])

  return {
    renderTrigger,
    triggerRender,
    triggerRenderImmediate
  }
}

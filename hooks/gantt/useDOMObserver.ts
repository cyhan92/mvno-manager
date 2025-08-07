import { useEffect, useRef } from 'react'

interface UseDOMObserverProps {
  scrollRef: React.RefObject<HTMLDivElement | null>
  onContentChange: () => void
}

export const useDOMObserver = ({ scrollRef, onContentChange }: UseDOMObserverProps) => {
  const observerRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let renderTimeout: NodeJS.Timeout | null = null
    
    observerRef.current = new MutationObserver((mutations) => {
      let shouldRerender = false
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
            shouldRerender = true
          }
        }
      })
      
      if (shouldRerender) {
        if (renderTimeout) {
          clearTimeout(renderTimeout)
        }
        
        renderTimeout = setTimeout(() => {
          requestAnimationFrame(() => {
            onContentChange()
          })
        }, 150)
      }
    })

    const ganttContainer = container.closest('[class*="gantt"]')
    const actionItemList = ganttContainer?.querySelector('[class*="action-item"]') || 
                          ganttContainer?.querySelector('[class*="task-list"]') ||
                          ganttContainer
    
    if (actionItemList) {
      observerRef.current.observe(actionItemList, {
        childList: true,
        subtree: true
      })
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (renderTimeout) {
        clearTimeout(renderTimeout)
      }
    }
  }, [scrollRef, onContentChange])

  return { observerRef }
}

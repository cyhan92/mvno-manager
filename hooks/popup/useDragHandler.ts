import { useState, useEffect } from 'react'

interface Position {
  x: number
  y: number
}

interface UseDragHandlerProps {
  onPositionChange: (position: Position) => void
}

export const useDragHandler = ({ onPositionChange }: UseDragHandlerProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // 드래그 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget.closest('[data-draggable]') as HTMLElement
    if (!target) return

    const rect = target.getBoundingClientRect()
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const popupWidth = 480 // 팝업 너비
    const popupHeight = 600 // 대략적인 팝업 높이

    let newX = e.clientX - dragOffset.x
    let newY = e.clientY - dragOffset.y

    // 경계 체크
    if (newX < 20) newX = 20
    if (newX + popupWidth > viewportWidth - 20) newX = viewportWidth - popupWidth - 20
    if (newY < 20) newY = 20
    if (newY + popupHeight > viewportHeight - 100) newY = viewportHeight - popupHeight - 100

    onPositionChange({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 드래그 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isDragging, dragOffset])

  return {
    isDragging,
    handleMouseDown
  }
}

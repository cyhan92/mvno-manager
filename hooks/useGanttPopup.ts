import { useState, useEffect } from 'react'
import { Task } from '../types/task'

interface PopupPosition {
  x: number
  y: number
}

export const useGanttPopup = () => {
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null)
  const [popupPosition, setPopupPosition] = useState<PopupPosition | null>(null)

  // 팝업 열기 - Canvas용 (position 기반)
  const openPopup = (task: Task, position: PopupPosition) => {
    if (!task.hasChildren) {
      // 팝업 위치 계산
      const popupX = position.x + 10 // 오른쪽에 10px 여백
      const popupY = position.y
      
      // 화면 경계 확인 및 조정
      const maxX = window.innerWidth - 450 // 팝업 너비(28rem ≈ 448px) 고려
      const maxY = window.innerHeight - 400 // 팝업 높이(25rem ≈ 400px) 고려
      
      setPopupPosition({
        x: Math.min(popupX, maxX),
        y: Math.min(popupY, maxY)
      })
      setSelectedTaskDetail(task)
    }
  }

  // 팝업 열기 - Action Item용 (DOM event 기반)
  const openPopupFromEvent = (task: Task, event: React.MouseEvent) => {
    if (!task.hasChildren) {
      event.stopPropagation()
      
      // 팝업 위치 계산
      const rect = event.currentTarget.getBoundingClientRect()
      const popupX = rect.right + 10 // 오른쪽에 10px 여백
      const popupY = rect.top
      
      // 화면 경계 확인 및 조정
      const maxX = window.innerWidth - 450 // 팝업 너비(28rem ≈ 448px) 고려
      const maxY = window.innerHeight - 400 // 팝업 높이(25rem ≈ 400px) 고려
      
      setPopupPosition({
        x: Math.min(popupX, maxX),
        y: Math.min(popupY, maxY)
      })
      setSelectedTaskDetail(task)
    }
  }

  // 팝업 닫기
  const closePopup = () => {
    setSelectedTaskDetail(null)
    setPopupPosition(null)
  }

  // ESC 키로 팝업 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedTaskDetail) {
        closePopup()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedTaskDetail])

  return {
    selectedTaskDetail,
    popupPosition,
    openPopup,
    openPopupFromEvent,
    closePopup,
    isOpen: !!(selectedTaskDetail && popupPosition)
  }
}

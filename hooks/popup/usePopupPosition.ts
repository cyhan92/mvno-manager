import { useState, useEffect, useRef } from 'react'

interface Position {
  x: number
  y: number
}

interface UsePopupPositionProps {
  initialPosition: Position
  popupRef: React.RefObject<HTMLDivElement | null>
}

export const usePopupPosition = ({ initialPosition, popupRef }: UsePopupPositionProps) => {
  const [currentPosition, setCurrentPosition] = useState(initialPosition)

  // 팝업 위치 초기화 및 경계 체크
  useEffect(() => {
    const adjustPosition = () => {
      const popup = popupRef.current
      if (!popup) return

      const rect = popup.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let newX = initialPosition.x
      let newY = initialPosition.y

      // 오른쪽 경계 체크
      if (newX + rect.width > viewportWidth) {
        newX = viewportWidth - rect.width - 20
      }

      // 왼쪽 경계 체크
      if (newX < 20) {
        newX = 20
      }

      // 아래쪽 경계 체크 (저장 버튼이 가려지지 않도록)
      if (newY + rect.height > viewportHeight - 100) {
        newY = viewportHeight - rect.height - 100
      }

      // 위쪽 경계 체크
      if (newY < 20) {
        newY = 20
      }

      setCurrentPosition({ x: newX, y: newY })
    }

    // 초기 위치 조정
    setTimeout(adjustPosition, 100)
  }, [initialPosition])

  const updatePosition = (newPosition: Position) => {
    setCurrentPosition(newPosition)
  }

  return {
    currentPosition,
    updatePosition
  }
}

import { useState, useEffect } from 'react'

interface Position {
  x: number
  y: number
}

export const usePopupPosition = (initialPosition: Position) => {
  const [currentPosition, setCurrentPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // 팝업 위치 초기화 및 경계 체크
  useEffect(() => {
    const adjustPosition = (pos: Position) => {
      const padding = 20
      const popupWidth = 400
      const popupHeight = 500
      
      const maxX = window.innerWidth - popupWidth - padding
      const maxY = window.innerHeight - popupHeight - padding
      
      return {
        x: Math.max(padding, Math.min(pos.x, maxX)),
        y: Math.max(padding, Math.min(pos.y, maxY))
      }
    }

    setCurrentPosition(adjustPosition(initialPosition))
  }, [initialPosition])

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.popup-header')) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - currentPosition.x,
        y: e.clientY - currentPosition.y
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      }
      
      const padding = 20
      const popupWidth = 400
      const popupHeight = 500
      
      const maxX = window.innerWidth - popupWidth - padding
      const maxY = window.innerHeight - popupHeight - padding
      
      setCurrentPosition({
        x: Math.max(padding, Math.min(newPosition.x, maxX)),
        y: Math.max(padding, Math.min(newPosition.y, maxY))
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  return {
    currentPosition,
    isDragging,
    handleMouseDown
  }
}

export const useTaskEdit = (initialTask: any) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    startDate: '',
    endDate: '',
    percentComplete: 0,
    resource: '',
    department: ''
  })

  useEffect(() => {
    setEditData({
      startDate: initialTask.start ? initialTask.start.toISOString().split('T')[0] : '',
      endDate: initialTask.end ? initialTask.end.toISOString().split('T')[0] : '',
      percentComplete: initialTask.percentComplete || 0,
      resource: initialTask.resource || '',
      department: initialTask.department || ''
    })
  }, [initialTask])

  const handleEditDataChange = (field: string, value: string | number) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetEditData = () => {
    setEditData({
      startDate: initialTask.start ? initialTask.start.toISOString().split('T')[0] : '',
      endDate: initialTask.end ? initialTask.end.toISOString().split('T')[0] : '',
      percentComplete: initialTask.percentComplete || 0,
      resource: initialTask.resource || '',
      department: initialTask.department || ''
    })
  }

  return {
    isEditing,
    setIsEditing,
    editData,
    handleEditDataChange,
    resetEditData
  }
}

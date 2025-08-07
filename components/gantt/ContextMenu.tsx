import React, { useEffect, useRef } from 'react'
import { Task } from '../../types/task'

interface ContextMenuProps {
  isOpen: boolean
  position: { x: number; y: number }
  task: Task | null
  onClose: () => void
  onAddActionItem: () => void
  onEditMajorCategory?: () => void
  onEditSubCategory?: () => void
  onAddSubCategory?: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  task,
  onClose,
  onAddActionItem,
  onEditMajorCategory,
  onEditSubCategory,
  onAddSubCategory
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleAddClick = () => {
    onAddActionItem()
    onClose()
  }

  const handleEditMajorCategoryClick = () => {
    if (onEditMajorCategory) {
      onEditMajorCategory()
    }
    onClose()
  }

  const handleEditSubCategoryClick = () => {
    if (onEditSubCategory) {
      onEditSubCategory()
    }
    onClose()
  }

  const handleAddSubCategoryClick = () => {
    if (onAddSubCategory) {
      onAddSubCategory()
    }
    onClose()
  }

  // 대분류인지 확인 (level 0)
  const isMajorCategory = task?.level === 0
  // 소분류인지 확인 (level 1)
  const isSubCategory = task?.level === 1

  return (
    <div 
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2 min-w-48"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      } as React.CSSProperties}
    >
      {/* 대분류 수정 메뉴 (대분류에서만 표시) */}
      {isMajorCategory && onEditMajorCategory && (
        <button
          onClick={handleEditMajorCategoryClick}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors flex items-center gap-2"
        >
          <span className="text-orange-500">✏️</span>
          대분류 수정
        </button>
      )}

      {/* 중분류,소분류 수정 메뉴 (소분류에서만 표시) */}
      {isSubCategory && onEditSubCategory && (
        <button
          onClick={handleEditSubCategoryClick}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors flex items-center gap-2"
        >
          <span className="text-green-500">✏️</span>
          중분류,소분류 수정
        </button>
      )}

      {/* 중분류,소분류 추가 메뉴 (소분류에서만 표시) */}
      {isSubCategory && onAddSubCategory && (
        <button
          onClick={handleAddSubCategoryClick}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
        >
          <span className="text-purple-500">➕</span>
          중분류,소분류 추가
        </button>
      )}
      
      {/* 상세 업무 추가 메뉴 (소분류에서만 표시) */}
      {isSubCategory && (
        <button
          onClick={handleAddClick}
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2"
        >
          <span className="text-blue-500">➕</span>
          상세 업무 추가
        </button>
      )}
    </div>
  )
}

export default ContextMenu

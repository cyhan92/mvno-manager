import React, { useState, useEffect, useRef } from 'react'
import { Task } from '../../types/task'

interface AddActionItemPopupProps {
  isOpen: boolean
  position: { x: number; y: number }
  parentTask: Task // 소분류 작업 (우클릭된 작업)
  onClose: () => void
  onAdd: (newTask: Partial<Task>) => void
}

const AddActionItemPopup: React.FC<AddActionItemPopupProps> = ({
  isOpen,
  position,
  parentTask,
  onClose,
  onAdd
}) => {
  const popupRef = useRef<HTMLDivElement>(null)
  const [currentPosition, setCurrentPosition] = useState(position)
  const [formData, setFormData] = useState({
    majorCategory: parentTask.majorCategory || '',
    middleCategory: parentTask.middleCategory || '',
    minorCategory: parentTask.minorCategory || '',
    taskName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7일 후
    resource: '',
    department: '',
    percentComplete: 0
  })

  // 팝업 위치 조정
  useEffect(() => {
    const adjustPosition = () => {
      const popup = popupRef.current
      if (!popup) return

      const rect = popup.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let newX = position.x
      let newY = position.y

      // 오른쪽 경계 체크
      if (newX + rect.width > viewportWidth) {
        newX = viewportWidth - rect.width - 20
      }

      // 왼쪽 경계 체크
      if (newX < 20) {
        newX = 20
      }

      // 아래쪽 경계 체크
      if (newY + rect.height > viewportHeight) {
        newY = viewportHeight - rect.height - 20
      }

      // 위쪽 경계 체크
      if (newY < 20) {
        newY = 20
      }

      setCurrentPosition({ x: newX, y: newY })
    }

    if (isOpen) {
      setTimeout(adjustPosition, 100)
    }
  }, [isOpen, position])

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

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.taskName.trim()) {
      alert('세부업무명을 입력해주세요.')
      return
    }

    if (!formData.startDate || !formData.endDate) {
      alert('시작일과 종료일을 입력해주세요.')
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('종료일은 시작일보다 늦어야 합니다.')
      return
    }

    // 새 작업 데이터 생성
    const newTask: Partial<Task> = {
      name: formData.taskName,
      detail: formData.taskName,
      majorCategory: formData.majorCategory,
      middleCategory: formData.middleCategory,
      minorCategory: formData.minorCategory,
      start: new Date(formData.startDate),
      end: new Date(formData.endDate),
      resource: formData.resource,
      department: formData.department || '',
      percentComplete: formData.percentComplete || 0,
      level: 2, // 세부업무 레벨
      parentId: parentTask?.id || '',
      category: formData.majorCategory,
      subcategory: formData.middleCategory,
      status: '미완료', // 데이터베이스 제약조건에 맞는 값으로 설정
      hasChildren: false,
      isGroup: false
    }

    onAdd(newTask)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* 팝업 */}
      <div 
        ref={popupRef}
        className="fixed bg-white rounded-lg shadow-xl border-2 border-gray-200 z-50 max-w-lg w-full"
        style={{
          left: currentPosition.x + 'px',
          top: currentPosition.y + 'px',
        }}
      >
        <form onSubmit={handleSubmit} className="p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ➕ Action Item 추가
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              aria-label="닫기"
            >
              ×
            </button>
          </div>

          {/* 폼 필드 */}
          <div className="space-y-4">
            {/* 대분류 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대분류 *
              </label>
              <input
                type="text"
                value={formData.majorCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, majorCategory: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="대분류를 입력하세요"
                required
              />
            </div>

            {/* 중분류 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                중분류
              </label>
              <input
                type="text"
                value={formData.middleCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, middleCategory: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="중분류를 입력하세요"
              />
            </div>

            {/* 소분류 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                소분류 *
              </label>
              <input
                type="text"
                value={formData.minorCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, minorCategory: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="소분류를 입력하세요"
                required
              />
            </div>

            {/* 세부업무명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                세부업무명 *
              </label>
              <input
                type="text"
                value={formData.taskName}
                onChange={(e) => setFormData(prev => ({ ...prev, taskName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="세부업무명을 입력하세요"
                required
              />
            </div>

            {/* 일정 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작일 *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="시작일을 선택하세요"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료일 *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="종료일을 선택하세요"
                  required
                />
              </div>
            </div>

            {/* 담당자 및 부서 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  담당자
                </label>
                <input
                  type="text"
                  value={formData.resource}
                  onChange={(e) => setFormData(prev => ({ ...prev, resource: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="담당자명"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  부서
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="부서명"
                />
              </div>
            </div>

            {/* 진행률 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                진행률: {formData.percentComplete}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.percentComplete}
                onChange={(e) => setFormData(prev => ({ ...prev, percentComplete: parseInt(e.target.value) }))}
                className="w-full"
                title={`진행률: ${formData.percentComplete}%`}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              ➕ 추가
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddActionItemPopup

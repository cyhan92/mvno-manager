import React, { useState, useEffect } from 'react'
import { Task } from '../../types/task'

interface SubCategoryEditPopupProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  currentMiddleCategory?: string
  currentSubCategory?: string
  onUpdateSubCategory: (taskId: string, middleCategory: string, subCategory: string, currentMiddleCategory?: string, currentSubCategory?: string) => void
  mode?: 'edit' | 'add'  // 수정 모드 또는 추가 모드
  onAddTask?: (newTask: Partial<Task>) => void  // 새 Task 생성용
}

const SubCategoryEditPopup: React.FC<SubCategoryEditPopupProps> = ({
  isOpen,
  onClose,
  task,
  currentMiddleCategory,
  currentSubCategory,
  onUpdateSubCategory,
  mode = 'edit',
  onAddTask
}) => {
  const [middleCategory, setMiddleCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [originalMiddleCategory, setOriginalMiddleCategory] = useState('')
  const [originalSubCategory, setOriginalSubCategory] = useState('')

  useEffect(() => {
    if (task && isOpen) {
      if (mode === 'add') {
        // 추가 모드: 중분류는 현재 task의 중분류를 기본값으로, 소분류는 비움
        let middleCategoryValue = currentMiddleCategory || task.middleCategory || ''
        
        // task.name에서 중분류 파싱 시도 ("[중분류] 소분류" 형식)
        if (!middleCategoryValue) {
          const taskName = task.name || ''
          const match = taskName.match(/^\[([^\]]+)\]\s*(.*)/)
          if (match) {
            middleCategoryValue = match[1] || ''
          }
        }
        
        setMiddleCategory(middleCategoryValue)
        setSubCategory('') // 소분류는 비움
        setOriginalMiddleCategory(middleCategoryValue)
        setOriginalSubCategory('')
      } else {
        // 수정 모드: 기존 로직
        let middleCategoryValue = currentMiddleCategory || task.middleCategory || ''
        let subCategoryValue = currentSubCategory || task.minorCategory || '' // minor_category가 소분류
        
        // 만약 속성이 없다면 task.name에서 파싱 시도 ("[중분류] 소분류" 형식)
        if (!middleCategoryValue || !subCategoryValue) {
          const taskName = task.name || ''
          const match = taskName.match(/^\[([^\]]+)\]\s*(.*)/)
          if (match) {
            middleCategoryValue = match[1] || middleCategoryValue
            subCategoryValue = match[2] || subCategoryValue
          }
        }
        
        setMiddleCategory(middleCategoryValue)
        setSubCategory(subCategoryValue)
        setOriginalMiddleCategory(middleCategoryValue)
        setOriginalSubCategory(subCategoryValue)
      }
    }
  }, [task, isOpen, currentMiddleCategory, currentSubCategory, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 중분류, 소분류 필수 입력 검증
    if (!middleCategory.trim()) {
      alert('중분류를 입력해주세요.')
      return
    }
    
    if (!subCategory.trim()) {
      alert('소분류를 입력해주세요.')
      return
    }
    
    if (task) {
      if (mode === 'add') {
        // 추가 모드: 새로운 세부업무 Task 생성
        
        if (onAddTask) {
          // 새로운 Task ID 생성 (고유성 보장을 위해 타임스탬프 + 밀리초 + 랜덤값 사용)
          const now = new Date()
          const timestamp = now.getTime() // 밀리초 포함 타임스탬프
          const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
          const taskId = `TASK-${timestamp}-${randomSuffix}`
          
          const newTask: Partial<Task> = {
            id: taskId,
            name: '상세업무_1',
            resource: '미정', // 기본값을 "미정"으로 설정
            start: new Date(), // 필수 필드
            end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 필수 필드 (7일 후)
            duration: 7, // 필수 필드
            percentComplete: 0, // 필수 필드
            dependencies: null, // 필수 필드
            majorCategory: task.majorCategory || '',
            middleCategory: middleCategory.trim(),
            minorCategory: subCategory.trim(),
            level: 2, // 세부업무 레벨
            hasChildren: false,
            parentId: task.id,
            // API에서 요구하는 추가 필드들
            category: task.majorCategory || '',
            subcategory: middleCategory.trim(),
            detail: subCategory.trim(),
            department: '미정', // 기본값을 "미정"으로 설정
            status: '미완료'
          }
          
          onAddTask(newTask)
        }
      } else {
        // 수정 모드: 기존 로직
        
        // 추가 파라미터와 함께 호출
        onUpdateSubCategory(
          task.id, 
          middleCategory.trim(), 
          subCategory.trim(),
          originalMiddleCategory,
          originalSubCategory
        )
      }
      onClose()
    }
  }

  const handleClose = () => {
    setMiddleCategory('')
    setSubCategory('')
    setOriginalMiddleCategory('')
    setOriginalSubCategory('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-full mx-4">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'add' ? '중분류,소분류 추가' : '중분류,소분류 수정'}
          </h2>
          {mode === 'add' && (
            <p className="text-sm text-gray-600 mt-2">
              새로운 중분류와 소분류를 입력하여 "상세업무_1" Task를 생성합니다.
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="middleCategory" className="block text-sm font-medium text-gray-700 mb-2">
              중분류 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="middleCategory"
              value={middleCategory}
              onChange={(e) => setMiddleCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={mode === 'add' ? '새로운 중분류를 입력하세요 (필수)' : '중분류를 입력하세요 (필수)'}
              required
            />
          </div>

          <div>
            <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-2">
              소분류 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subCategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={mode === 'add' ? '새로운 소분류를 입력하세요 (필수)' : '소분류를 입력하세요 (필수)'}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {mode === 'add' ? '추가' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubCategoryEditPopup

import React, { useEffect, useState } from 'react'
import { Task } from '../../../../types/task'
import { extractCategoryHierarchy, CategoryHierarchy } from '../../../../utils/categoryUtils'

interface HierarchicalCategoryEditorProps {
  majorCategory: string
  middleCategory: string
  minorCategory: string
  onMajorChange: (value: string) => void
  onMiddleChange: (value: string) => void
  onMinorChange: (value: string) => void
  tasks: Task[] // 전체 작업 목록 (카테고리 옵션 생성용)
  disabled?: boolean
  className?: string
}

const HierarchicalCategoryEditor: React.FC<HierarchicalCategoryEditorProps> = ({
  majorCategory,
  middleCategory,
  minorCategory,
  onMajorChange,
  onMiddleChange,
  onMinorChange,
  tasks,
  disabled = false,
  className = ''
}) => {
  const [categoryHierarchy, setCategoryHierarchy] = useState<CategoryHierarchy>({
    majorCategories: [],
    middleCategories: {},
    minorCategories: {}
  })

  // 작업 목록이 변경될 때마다 카테고리 계층 구조 업데이트
  useEffect(() => {
    const hierarchy = extractCategoryHierarchy(tasks)
    setCategoryHierarchy(hierarchy)
  }, [tasks])

  // 대분류 변경 시 중분류, 소분류 초기화
  const handleMajorChange = (value: string) => {
    onMajorChange(value)
    onMiddleChange('')
    onMinorChange('')
  }

  // 중분류 변경 시 소분류 초기화
  const handleMiddleChange = (value: string) => {
    onMiddleChange(value)
    onMinorChange('')
  }

  // 현재 선택된 대분류에 따른 중분류 옵션
  const availableMiddleCategories = majorCategory ? (categoryHierarchy.middleCategories[majorCategory] || []) : []

  // 현재 선택된 대분류, 중분류에 따른 소분류 옵션
  const availableMinorCategories = majorCategory && middleCategory 
    ? (categoryHierarchy.minorCategories[majorCategory]?.[middleCategory] || [])
    : []

  return (
    <div className={className}>
      <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
        <span className="text-sm">🏷️</span>
        카테고리(대분류&gt;중분류&gt;소분류)
      </label>
      
      <div className="mt-1 space-y-2">
        {/* 대분류 선택 */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">대분류</label>
          <select
            value={majorCategory}
            onChange={(e) => handleMajorChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled}
            title="대분류를 선택하세요"
          >
            <option value="">대분류를 선택하세요</option>
            {categoryHierarchy.majorCategories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 중분류 선택 */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">중분류</label>
          <select
            value={middleCategory}
            onChange={(e) => handleMiddleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled || !majorCategory}
            title="중분류를 선택하세요"
          >
            <option value="">중분류를 선택하세요</option>
            {availableMiddleCategories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* 소분류 선택 */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">소분류</label>
          <select
            value={minorCategory}
            onChange={(e) => onMinorChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={disabled || !majorCategory || !middleCategory}
            title="소분류를 선택하세요"
          >
            <option value="">소분류를 선택하세요</option>
            {availableMinorCategories.map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default HierarchicalCategoryEditor

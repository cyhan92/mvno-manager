import React from 'react'

interface CategoryEditorProps {
  majorCategory: string
  middleCategory: string
  minorCategory: string
  onMajorChange: (value: string) => void
  onMiddleChange: (value: string) => void
  onMinorChange: (value: string) => void
  disabled?: boolean
  className?: string
}

const CategoryEditor: React.FC<CategoryEditorProps> = ({
  majorCategory,
  middleCategory,
  minorCategory,
  onMajorChange,
  onMiddleChange,
  onMinorChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-600">카테고리(대분류&gt;중분류&gt;소분류)</label>
      <div className="mt-1 flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-500">[</span>
        <input
          type="text"
          value={majorCategory}
          onChange={(e) => onMajorChange(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1"
          placeholder="대분류"
          disabled={disabled}
          title="대분류를 입력하세요"
        />
        <span className="text-sm text-gray-500">&gt;</span>
        <input
          type="text"
          value={middleCategory}
          onChange={(e) => onMiddleChange(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1"
          placeholder="중분류"
          disabled={disabled}
          title="중분류를 입력하세요"
        />
        <span className="text-sm text-gray-500">&gt;</span>
        <input
          type="text"
          value={minorCategory}
          onChange={(e) => onMinorChange(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0 flex-1"
          placeholder="소분류"
          disabled={disabled}
          title="소분류를 입력하세요"
        />
        <span className="text-sm text-gray-500">]</span>
      </div>
    </div>
  )
}

export default CategoryEditor

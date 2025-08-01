import React from 'react'

interface HeaderProps {
  taskCount: number
  onRefresh: () => void
}

const Header: React.FC<HeaderProps> = ({
  taskCount,
  onRefresh
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🚀 스노우모바일 MVNO 프로젝트 관리
            </h1>
            <p className="text-gray-600 mt-1">총 {taskCount}개 작업 | Excel 파일 기반</p>
          </div>
          
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            📄 Excel 새로고침
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

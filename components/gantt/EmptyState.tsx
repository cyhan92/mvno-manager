import React from 'react'

interface EmptyStateProps {
  totalTasks: number
  treeNodesCount: number
  expandedNodesCount: number
}

const EmptyState: React.FC<EmptyStateProps> = ({
  totalTasks,
  treeNodesCount,
  expandedNodesCount
}) => {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border">
      <div className="text-center">
        <p className="text-gray-500 mb-2">표시할 작업이 없습니다.</p>
        <p className="text-sm text-gray-400">'+' 버튼을 클릭하여 항목을 펼쳐보세요.</p>
        <p className="text-xs text-gray-300 mt-2">
          전체 작업: {totalTasks}개 | 트리 노드: {treeNodesCount}개 | 펼쳐진 노드: {expandedNodesCount}개
        </p>
      </div>
    </div>
  )
}

export default EmptyState

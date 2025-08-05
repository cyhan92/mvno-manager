import React, { useState } from 'react'
import { ResourceStats, Task } from '../types/task'
import { formatPercent } from '../utils/task'
import styles from '../styles/common.module.css'
import ResourceTasksPopup from './ResourceTasksPopup'

interface ResourceStatsComponentProps {
  resourceStats: Record<string, ResourceStats>
  tasks: Task[] // 전체 작업 목록 추가
  onTaskUpdate?: (updatedTask: Task) => void // 작업 업데이트 콜백 추가
}

const ResourceStatsComponent: React.FC<ResourceStatsComponentProps> = ({ resourceStats, tasks, onTaskUpdate }) => {
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  // 특정 담당자의 작업 목록 가져오기
  const getResourceTasks = (resource: string): Task[] => {
    return tasks.filter(task => task.resource === resource)
  }

  // 담당자 더블클릭 핸들러
  const handleResourceDoubleClick = (resource: string) => {
    setSelectedResource(resource)
    setIsPopupOpen(true)
  }

  // 팝업 닫기
  const closePopup = () => {
    setIsPopupOpen(false)
    setSelectedResource(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 담당자별 현황</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(resourceStats).map(([resource, stats]) => (
          <div 
            key={resource} 
            className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onDoubleClick={() => handleResourceDoubleClick(resource)}
            title="더블클릭하여 상세 업무 보기"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900">{resource}</h4>
              <span className="text-sm text-gray-600">
                {stats.completed}/{stats.total}
              </span>
            </div>
            <div className={`mb-2 ${styles.resourceProgressContainer}`}>
              <div
                className={`${styles.resourceProgressFill}`}
                // eslint-disable-next-line react/forbid-dom-props
                style={{
                  '--progress-width': `${stats.progress}%`
                } as React.CSSProperties}
              />
            </div>
            <p className="text-sm text-gray-600">
              평균 {formatPercent(stats.progress)} 진행
            </p>
          </div>
        ))}
      </div>

      {/* 담당자별 세부업무 팝업 */}
      {selectedResource && (
        <ResourceTasksPopup
          resource={selectedResource}
          tasks={getResourceTasks(selectedResource)}
          isOpen={isPopupOpen}
          onClose={closePopup}
          onTaskUpdate={onTaskUpdate}
        />
      )}
    </div>
  )
}

export default ResourceStatsComponent

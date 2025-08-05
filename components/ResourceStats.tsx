import React from 'react'
import { ResourceStats } from '../types/task'
import { formatPercent } from '../utils/task'
import styles from '../styles/common.module.css'

interface ResourceStatsComponentProps {
  resourceStats: Record<string, ResourceStats>
}

const ResourceStatsComponent: React.FC<ResourceStatsComponentProps> = ({ resourceStats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 담당자별 현황</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(resourceStats).map(([resource, stats]) => (
          <div key={resource} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900">{resource}</h4>
              <span className="text-sm text-gray-600">
                {stats.completed}/{stats.total}
              </span>
            </div>
            <div className={`mb-2 ${styles.resourceProgressContainer}`}>
              <div
                className={`${styles.resourceProgressFill}`}
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              평균 {formatPercent(stats.progress)} 진행
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResourceStatsComponent

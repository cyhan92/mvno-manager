import React from 'react'
import { TaskStats } from '../types/task'
import { formatPercent } from '../utils/task'
import styles from '../styles/components.module.css'

interface StatsDashboardProps {
  stats: TaskStats
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  const { completed, inProgress, notStarted, averageProgress, total } = stats

  const completedPercent = total > 0 ? (completed / total) * 100 : 0
  const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0
  const notStartedPercent = total > 0 ? (notStarted / total) * 100 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 전체 진행률 */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">전체 진행률</h3>
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-blue-600">
              {formatPercent(averageProgress)}
            </span>
            <div className="text-sm text-gray-600">
              평균 진행률
            </div>
          </div>
          <div className={`mt-2 ${styles.progressContainer}`}>
            <div
              className={`${styles.progressFill} ${styles.progressBar}`}
              style={{ width: `${averageProgress}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* 완료 */}
      <div className="bg-green-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-green-900">완료</h3>
        <p className="text-3xl font-bold text-green-600">{completed}</p>
        <p className="text-sm text-green-700 mt-1">
          전체의 {formatPercent(completedPercent)}
        </p>
      </div>
      
      {/* 진행중 */}
      <div className="bg-blue-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-blue-900">진행중</h3>
        <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
        <p className="text-sm text-blue-700 mt-1">
          전체의 {formatPercent(inProgressPercent)}
        </p>
      </div>
      
      {/* 미시작 */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900">미시작</h3>
        <p className="text-3xl font-bold text-gray-600">{notStarted}</p>
        <p className="text-sm text-gray-700 mt-1">
          전체의 {formatPercent(notStartedPercent)}
        </p>
      </div>
    </div>
  )
}

export default StatsDashboard

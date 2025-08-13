import React, { useState } from 'react'
import { TaskStats, Task } from '../types/task'
import { formatPercent } from '../utils/task'
import styles from '../styles/common.module.css'
import StatusTasksPopup from './StatusTasksPopup'

interface StatsDashboardProps {
  stats: TaskStats
  tasks?: Task[] // 전체 작업 목록 추가
  onTaskUpdate?: (updatedTask: Task) => void // 작업 업데이트 콜백 추가
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, tasks = [], onTaskUpdate }) => {
  const { completed, inProgress, notStarted, averageProgress, total } = stats
  const [selectedStatus, setSelectedStatus] = useState<'completed' | 'inProgress' | 'notStarted' | 'delayed' | null>(null)
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false)

  const completedPercent = total > 0 ? (completed / total) * 100 : 0
  const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0
  // 지연/미시작 계산은 전체 tasks 기반으로 동적 계산
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const isDelayed = (t: Task) => {
    const start = t.start instanceof Date ? t.start : new Date(t.start)
    return !!start && start < startOfToday && (t.percentComplete || 0) === 0
  }
  const isNotStarted = (t: Task) => {
    const start = t.start instanceof Date ? t.start : new Date(t.start)
    return !!start && start > startOfToday && (t.percentComplete || 0) === 0
  }
  const delayedCount = tasks.filter(isDelayed).length
  const notStartedFutureCount = tasks.filter(isNotStarted).length
  const notStartedPercent = total > 0 ? (notStartedFutureCount / total) * 100 : 0
  const delayedPercent = total > 0 ? (delayedCount / total) * 100 : 0

  // 상태별 작업 목록 필터링 (상태값 우선, 없으면 완료율로 판단)
  const getTasksByStatus = (status: 'completed' | 'inProgress' | 'notStarted' | 'delayed'): Task[] => {
    switch (status) {
      case 'completed':
        return tasks.filter(task => {
          const byStatus = task.status === '완료'
          const byPercent = typeof task.percentComplete === 'number' && task.percentComplete === 100
          return byStatus || byPercent
        })
      case 'inProgress':
        return tasks.filter(task => {
          const byStatus = task.status === '진행중'
          const byPercent = typeof task.percentComplete === 'number' && task.percentComplete > 0 && task.percentComplete < 100
          return byStatus || byPercent
        })
      case 'notStarted':
        return tasks.filter(isNotStarted)
      case 'delayed':
        return tasks.filter(isDelayed)
      default:
        return []
    }
  }

  // 상태 박스 더블클릭 핸들러
  const handleStatusDoubleClick = (status: 'completed' | 'inProgress' | 'notStarted' | 'delayed') => {
    setSelectedStatus(status)
    setIsStatusPopupOpen(true)
  }

  // 팝업 닫기
  const closeStatusPopup = () => {
    setIsStatusPopupOpen(false)
    setSelectedStatus(null)
  }

  return (
    <>
      {/* 첫 번째 라인: 전체 진행률 */}
      <div className="mb-3">
        <div className="bg-white p-3 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">전체 진행률</h3>
          <div className="mt-1">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-blue-600">
                {formatPercent(averageProgress)}
              </span>
              <div className="text-sm text-gray-600">
                평균 진행률
              </div>
            </div>
            <div className={`mt-1 ${styles.progressContainer}`}>
              <progress
                className={styles.progressNative}
                value={averageProgress}
                max={100}
                aria-label="전체 진행률"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 두 번째 라인: 완료, 진행중, 미시작, 지연 */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* 완료 */}
        <div 
      className="bg-green-50 p-3 rounded-lg border cursor-pointer hover:bg-green-100 transition-colors"
          onDoubleClick={() => handleStatusDoubleClick('completed')}
          title="더블클릭하여 완료된 작업 목록 보기"
        >
          <h3 className="text-lg font-semibold text-green-900">완료</h3>
      <p className="text-xl font-bold text-green-600">{completed}</p>
          <p className="text-sm text-green-700 mt-1">
            전체의 {formatPercent(completedPercent)}
          </p>
        </div>

        {/* 진행중 */}
        <div 
          className="bg-blue-50 p-3 rounded-lg border cursor-pointer hover:bg-blue-100 transition-colors"
          onDoubleClick={() => handleStatusDoubleClick('inProgress')}
          title="더블클릭하여 진행중인 작업 목록 보기"
        >
          <h3 className="text-lg font-semibold text-blue-900">진행중</h3>
          <p className="text-xl font-bold text-blue-600">{inProgress}</p>
          <p className="text-sm text-blue-700 mt-1">
            전체의 {formatPercent(inProgressPercent)}
          </p>
        </div>

        {/* 미시작 */}
        <div 
          className="bg-gray-50 p-3 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors"
          onDoubleClick={() => handleStatusDoubleClick('notStarted')}
          title="더블클릭하여 미시작 작업 목록 보기"
        >
          <h3 className="text-lg font-semibold text-gray-900">미시작</h3>
          <p className="text-xl font-bold text-gray-600">{notStartedFutureCount}</p>
          <p className="text-sm text-gray-700 mt-1">
            전체의 {formatPercent(notStartedPercent)}
          </p>
        </div>

        {/* 지연 */}
        <div 
          className="bg-red-50 p-3 rounded-lg border cursor-pointer hover:bg-red-100 transition-colors"
          onDoubleClick={() => handleStatusDoubleClick('delayed')}
          title="더블클릭하여 지연 작업 목록 보기"
        >
          <h3 className="text-lg font-semibold text-red-900">지연</h3>
          <p className="text-xl font-bold text-red-600">{delayedCount}</p>
          <p className="text-sm text-red-700 mt-1">
            전체의 {formatPercent(delayedPercent)}
          </p>
        </div>
      </div>

      {/* 상태별 작업 목록 팝업 */}
      {selectedStatus && (
        <StatusTasksPopup
          status={selectedStatus}
          tasks={getTasksByStatus(selectedStatus)}
          isOpen={isStatusPopupOpen}
          onClose={closeStatusPopup}
          onTaskUpdate={onTaskUpdate}
        />
      )}
    </>
  )
}

export default StatsDashboard

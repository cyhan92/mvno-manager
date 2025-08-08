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
  const [selectedStatus, setSelectedStatus] = useState<'completed' | 'inProgress' | 'notStarted' | null>(null)
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false)

  const completedPercent = total > 0 ? (completed / total) * 100 : 0
  const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0
  const notStartedPercent = total > 0 ? (notStarted / total) * 100 : 0

  // 상태별 작업 목록 필터링 (상태값 우선, 없으면 완료율로 판단)
  const getTasksByStatus = (status: 'completed' | 'inProgress' | 'notStarted'): Task[] => {
    switch (status) {
      case 'completed':
        return tasks.filter(task => {
          if (task.status) {
            return task.status === '완료'
          }
          return task.percentComplete === 100
        })
      case 'inProgress':
        return tasks.filter(task => {
          if (task.status) {
            return task.status === '진행중'
          }
          return task.percentComplete > 0 && task.percentComplete < 100
        })
      case 'notStarted':
        return tasks.filter(task => {
          if (task.status) {
            return task.status === '미진행' || task.status === '미완료'
          }
          return task.percentComplete === 0
        })
      default:
        return []
    }
  }

  // 상태 박스 더블클릭 핸들러
  const handleStatusDoubleClick = (status: 'completed' | 'inProgress' | 'notStarted') => {
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
      <div 
        className="bg-green-50 p-6 rounded-lg border cursor-pointer hover:bg-green-100 transition-colors"
        onDoubleClick={() => handleStatusDoubleClick('completed')}
        title="더블클릭하여 완료된 작업 목록 보기"
      >
        <h3 className="text-lg font-semibold text-green-900">완료</h3>
        <p className="text-3xl font-bold text-green-600">{completed}</p>
        <p className="text-sm text-green-700 mt-1">
          전체의 {formatPercent(completedPercent)}
        </p>
      </div>
      
      {/* 진행중 */}
      <div 
        className="bg-blue-50 p-6 rounded-lg border cursor-pointer hover:bg-blue-100 transition-colors"
        onDoubleClick={() => handleStatusDoubleClick('inProgress')}
        title="더블클릭하여 진행중인 작업 목록 보기"
      >
        <h3 className="text-lg font-semibold text-blue-900">진행중</h3>
        <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
        <p className="text-sm text-blue-700 mt-1">
          전체의 {formatPercent(inProgressPercent)}
        </p>
      </div>
      
      {/* 미시작 */}
      <div 
        className="bg-gray-50 p-6 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors"
        onDoubleClick={() => handleStatusDoubleClick('notStarted')}
        title="더블클릭하여 미시작 작업 목록 보기"
      >
        <h3 className="text-lg font-semibold text-gray-900">미시작</h3>
        <p className="text-3xl font-bold text-gray-600">{notStarted}</p>
        <p className="text-sm text-gray-700 mt-1">
          전체의 {formatPercent(notStartedPercent)}
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
  </>)
}

export default StatsDashboard

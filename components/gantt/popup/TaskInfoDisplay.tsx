import React from 'react'
import { Task } from '../../../types/task'
import styles from '../../../styles/task-detail-popup.module.css'

interface TaskInfoDisplayProps {
  task: Task
}

const TaskInfoDisplay: React.FC<TaskInfoDisplayProps> = ({ task }) => {
  // 날짜 포맷팅 함수
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return '미정'
    return date.toLocaleDateString('ko-KR')
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
          <span className="text-sm">📋</span>
          작업명
        </label>
        <p className="text-base font-semibold text-gray-900 mt-1">
          {task.name || task.title || '작업명 없음'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
            <span className="text-sm">🗓️</span>
            시작일
          </label>
          <p className="text-sm text-gray-900 mt-1">
            {formatDate(task.start)}
          </p>
        </div>
        <div>
          <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
            <span className="text-sm">🏁</span>
            종료일
          </label>
          <p className="text-sm text-gray-900 mt-1">
            {formatDate(task.end)}
          </p>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
          <span className="text-sm">📊</span>
          진행률
        </label>
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"
            style={{ 
              width: `${Math.min(Math.max(task.percentComplete || 0, 0), 100)}%`,
              transition: 'none'
            }}
          />
        </div>
        <p className="text-sm text-gray-700 mt-1">{task.percentComplete || 0}% 완료</p>
      </div>
      
      <div>
        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
          <span className="text-sm">👤</span>
          담당자
        </label>
        <p className="text-sm text-gray-900 mt-1">{task.resource || '미정'}</p>
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
          <span className="text-sm">🏢</span>
          부서
        </label>
        <p className="text-sm text-gray-900 mt-1">{task.department || '미정'}</p>
      </div>

      {(task.majorCategory || task.middleCategory || task.minorCategory) && (
        <div>
          <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
            <span className="text-sm">🏷️</span>
            카테고리
          </label>
          <p className="text-sm text-gray-900 mt-1">
            {[task.majorCategory, task.middleCategory, task.minorCategory]
              .filter(Boolean)
              .join(' > ')}
          </p>
        </div>
      )}

      {task.status && (
        <div>
          <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
            <span className="text-sm">🔄</span>
            상태
          </label>
          <p className="text-sm text-gray-900 mt-1">{task.status}</p>
        </div>
      )}

      {/* 상세 설명을 가장 아래로 이동 */}
      <div>
        <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
          <span className="text-sm">📝</span>
          상세정보(메모)
        </label>
        <div className="mt-1 p-2 border border-gray-200 rounded-md bg-gray-50">
          <div 
            className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[5em] max-h-[8em] overflow-auto"
          >
            {task.detail || '상세 설명이 없습니다.'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskInfoDisplay

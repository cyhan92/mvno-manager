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
        <label className="text-sm font-medium text-gray-600">작업명</label>
        <p className="text-base font-semibold text-gray-900 mt-1">
          {task.name || task.detail || '작업명 없음'}
        </p>
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-600">상세 설명</label>
        <p className="text-sm text-gray-700 mt-1">
          {task.detail || '상세 설명이 없습니다.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">시작일</label>
          <p className="text-sm text-gray-900 mt-1">
            {formatDate(task.start)}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">종료일</label>
          <p className="text-sm text-gray-900 mt-1">
            {formatDate(task.end)}
          </p>
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-600">진행률</label>
        <div className={styles.taskDetailProgressContainer}>
          <div 
            className={styles.taskDetailProgressFill}
            style={
              {
                '--progress-width': `${task.percentComplete || 0}%`
              } as React.CSSProperties
            }
          />
        </div>
        <p className="text-sm text-gray-700 mt-1">{task.percentComplete || 0}% 완료</p>
      </div>
      
      <div>
        <label className="text-sm font-medium text-gray-600">담당자</label>
        <p className="text-sm text-gray-900 mt-1">{task.resource || '미정'}</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">부서</label>
        <p className="text-sm text-gray-900 mt-1">{task.department || '미정'}</p>
      </div>

      {(task.majorCategory || task.middleCategory || task.minorCategory) && (
        <div>
          <label className="text-sm font-medium text-gray-600">카테고리</label>
          <p className="text-sm text-gray-900 mt-1">
            {[task.majorCategory, task.middleCategory, task.minorCategory]
              .filter(Boolean)
              .join(' > ')}
          </p>
        </div>
      )}

      {task.status && (
        <div>
          <label className="text-sm font-medium text-gray-600">상태</label>
          <p className="text-sm text-gray-900 mt-1">{task.status}</p>
        </div>
      )}
    </div>
  )
}

export default TaskInfoDisplay

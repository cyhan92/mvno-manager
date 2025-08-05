import React from 'react'
import { Task } from '../../types/task'
import styles from '../../styles'

interface TaskDetailPopupProps {
  task: Task
  position: { x: number; y: number }
  onClose: () => void
}

const TaskDetailPopup: React.FC<TaskDetailPopupProps> = ({
  task,
  position,
  onClose
}) => {
  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className={styles.taskDetailOverlay}
        onClick={onClose}
      />
      
      {/* 팝업 내용 */}
      <div 
        className={`${styles.taskDetailPopup} ${styles.popupPositioned}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">📋 작업 상세 정보</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        
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
                {task.start ? task.start.toLocaleDateString('ko-KR') : '미정'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">종료일</label>
              <p className="text-sm text-gray-900 mt-1">
                {task.end ? task.end.toLocaleDateString('ko-KR') : '미정'}
              </p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">진행률</label>
            <div className={styles.taskDetailProgressContainer}>
              <div 
                className={styles.taskDetailProgressFill}
                style={{ width: `${task.percentComplete || 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-700 mt-1">{task.percentComplete || 0}% 완료</p>
          </div>
          
          {task.resource && (
            <div>
              <label className="text-sm font-medium text-gray-600">담당자</label>
              <p className="text-sm text-gray-900 mt-1">{task.resource}</p>
            </div>
          )}
          
          {task.category && (
            <div>
              <label className="text-sm font-medium text-gray-600">카테고리</label>
              <p className="text-sm text-gray-900 mt-1">{task.category}</p>
            </div>
          )}

          {task.status && (
            <div>
              <label className="text-sm font-medium text-gray-600">상태</label>
              <p className="text-sm text-gray-900 mt-1">{task.status}</p>
            </div>
          )}

          {task.department && (
            <div>
              <label className="text-sm font-medium text-gray-600">부서</label>
              <p className="text-sm text-gray-900 mt-1">{task.department}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">💡 팁: ESC 키 또는 배경 클릭으로 닫을 수 있습니다.</p>
        </div>
      </div>
    </>
  )
}

export default TaskDetailPopup

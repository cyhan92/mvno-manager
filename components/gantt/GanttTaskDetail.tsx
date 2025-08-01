import React from 'react'
import { Task } from '../../types/task'
import { getStatusBadgeClass, formatDate, formatDuration, formatProgress } from '../../utils/gantt'
import styles from '../../styles/components.module.css'

interface GanttTaskDetailProps {
  selectedTask: Task | null
  onClose?: () => void
}

const GanttTaskDetail: React.FC<GanttTaskDetailProps> = ({ selectedTask, onClose }) => {
  if (!selectedTask) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900">
          📋 작업 상세 정보
        </h4>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">작업명</label>
          <p className="mt-1 text-sm text-gray-900">{selectedTask.name}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">담당자</label>
          <p className="mt-1 text-sm text-gray-900">{selectedTask.resource}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">대분류</label>
          <p className="mt-1 text-sm text-gray-900">
            {selectedTask.majorCategory || selectedTask.category || '미분류'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">중분류</label>
          <p className="mt-1 text-sm text-gray-900">
            {selectedTask.middleCategory || selectedTask.subcategory || '-'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">소분류</label>
          <p className="mt-1 text-sm text-gray-900">
            {selectedTask.minorCategory || selectedTask.detail || '-'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">주관부서</label>
          <p className="mt-1 text-sm text-gray-900">
            {selectedTask.department || '-'}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">상태</label>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(selectedTask.status)}`}>
            {selectedTask.status || '미완료'}
          </span>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">시작일</label>
          <p className="mt-1 text-sm text-gray-900">
            {formatDate(selectedTask.start)}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">종료일</label>
          <p className="mt-1 text-sm text-gray-900">
            {formatDate(selectedTask.end)}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">기간</label>
          <p className="mt-1 text-sm text-gray-900">
            {formatDuration(selectedTask.start, selectedTask.end)}
          </p>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">진행률</label>
          <div className="mt-1 flex items-center space-x-2">
            <div className={styles['task-detail-progress-container']}>
              <div
                className={styles['task-detail-progress-fill']}
                style={{
                  width: `${selectedTask.percentComplete}%`
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatProgress(selectedTask.percentComplete)}
            </span>
          </div>
        </div>
        
        {selectedTask.cost && (
          <div>
            <label className="block text-sm font-medium text-gray-700">예상 비용</label>
            <p className="mt-1 text-sm text-gray-900">
              {selectedTask.cost}
            </p>
          </div>
        )}
        
        {selectedTask.notes && (
          <div className={selectedTask.cost ? '' : 'md:col-span-2'}>
            <label className="block text-sm font-medium text-gray-700">비고</label>
            <p className="mt-1 text-sm text-gray-900">
              {selectedTask.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GanttTaskDetail

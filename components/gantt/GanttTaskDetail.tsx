import React from 'react'
import { Task } from '../../types/task'
import { getStatusBadgeClass, formatDate } from '../../utils/gantt'
import taskDetailPopupStyles from '../../styles/task-detail-popup.module.css'

interface GanttTaskDetailProps {
  selectedTask: Task | null
  onClose?: () => void
  position?: { x: number; y: number }
  isPopup?: boolean
}

const GanttTaskDetail: React.FC<GanttTaskDetailProps> = ({ 
  selectedTask, 
  onClose, 
  position,
  isPopup = false 
}) => {
  // 팝업 위치 설정을 위한 ref
  const popupRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    if (isPopup && position && popupRef.current) {
      // 화면 경계를 고려한 위치 조정
      const popup = popupRef.current
      const rect = popup.getBoundingClientRect()
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      let adjustedX = position.x
      let adjustedY = position.y

      // 오른쪽 경계 체크
      if (position.x + rect.width > screenWidth) {
        adjustedX = screenWidth - rect.width - 10
      }
      
      // 하단 경계 체크
      if (position.y + rect.height > screenHeight) {
        adjustedY = screenHeight - rect.height - 10
      }
      
      popup.style.left = `${adjustedX}px`
      popup.style.top = `${adjustedY}px`
    }
  }, [isPopup, position])

  if (!selectedTask) {
    return null
  }

  // 팝업 스타일과 기본 스타일 구분
  const containerClass = isPopup 
    ? taskDetailPopupStyles.taskDetailPopup
    : 'bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-md'

  const task = selectedTask

  return (
    <div
      ref={popupRef}
      className={containerClass}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">작업 상세정보</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* 작업명 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">작업명</label>
          <p className="text-sm text-gray-900">{task.name}</p>
        </div>

        {/* 상태 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(task.status)}`}>
            {task.status}
          </span>
        </div>

        {/* 진행률 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">진행률</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.percentComplete || 0}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">{task.percentComplete || 0}%</span>
          </div>
        </div>

        {/* 담당자 */}
        {task.resource && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
            <p className="text-sm text-gray-900">{task.resource}</p>
          </div>
        )}

        {/* 시작일 */}
        {task.start && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
            <p className="text-sm text-gray-900">{formatDate(task.start)}</p>
          </div>
        )}

        {/* 종료일 */}
        {task.end && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
            <p className="text-sm text-gray-900">{formatDate(task.end)}</p>
          </div>
        )}

        {/* 기간 */}
        {task.start && task.end && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">기간</label>
            <p className="text-sm text-gray-900">
              {Math.ceil((new Date(task.end).getTime() - new Date(task.start).getTime()) / (1000 * 60 * 60 * 24))}일
            </p>
          </div>
        )}

        {/* 카테고리 */}
        {task.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <p className="text-sm text-gray-900">{task.category}</p>
          </div>
        )}

        {/* 설명 */}
        {task.detail && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상세내용</label>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{task.detail}</p>
          </div>
        )}

        {/* 부서 */}
        {task.department && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">부서</label>
            <p className="text-sm text-gray-900">{task.department}</p>
          </div>
        )}

        {/* 비용 */}
        {task.cost && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비용</label>
            <p className="text-sm text-gray-900">{task.cost}</p>
          </div>
        )}

        {/* 비고 */}
        {task.notes && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비고</label>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{task.notes}</p>
          </div>
        )}

        {/* 대분류 */}
        {task.majorCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대분류</label>
            <p className="text-sm text-gray-900">{task.majorCategory}</p>
          </div>
        )}

        {/* 중분류 */}
        {task.middleCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">중분류</label>
            <p className="text-sm text-gray-900">{task.middleCategory}</p>
          </div>
        )}

        {/* 소분류 */}
        {task.subcategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">소분류</label>
            <p className="text-sm text-gray-900">{task.subcategory}</p>
          </div>
        )}

        {/* ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <p className="text-sm text-gray-500 font-mono">{task.id}</p>
        </div>
      </div>
    </div>
  )
}

export default GanttTaskDetail
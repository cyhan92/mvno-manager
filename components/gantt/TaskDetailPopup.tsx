import React, { useState, useEffect, useRef } from 'react'
import { Task } from '../../types/task'
import styles from '../../styles/task-detail-popup.module.css'

interface TaskDetailPopupProps {
  task: Task
  position: { x: number; y: number }
  onClose: () => void
  onTaskUpdate?: (updatedTask: Task) => void
}

const TaskDetailPopup: React.FC<TaskDetailPopupProps> = ({
  task,
  position,
  onClose,
  onTaskUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(position)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const popupRef = useRef<HTMLDivElement>(null)
  const [editData, setEditData] = useState({
    startDate: '',
    endDate: '',
    percentComplete: 0,
    resource: ''
  })

  // Initialize edit data
  useEffect(() => {
    setEditData({
      startDate: task.start ? task.start.toISOString().split('T')[0] : '',
      endDate: task.end ? task.end.toISOString().split('T')[0] : '',
      percentComplete: task.percentComplete || 0,
      resource: task.resource || ''
    })
  }, [task])

  // 팝업 위치 초기화 및 경계 체크
  useEffect(() => {
    const adjustPosition = () => {
      const popup = popupRef.current
      if (!popup) return

      const rect = popup.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let newX = position.x
      let newY = position.y

      // 오른쪽 경계 체크
      if (newX + rect.width > viewportWidth) {
        newX = viewportWidth - rect.width - 20
      }

      // 왼쪽 경계 체크
      if (newX < 20) {
        newX = 20
      }

      // 아래쪽 경계 체크 (저장 버튼이 가려지지 않도록)
      if (newY + rect.height > viewportHeight - 100) {
        newY = viewportHeight - rect.height - 100
      }

      // 위쪽 경계 체크
      if (newY < 20) {
        newY = 20
      }

      setCurrentPosition({ x: newX, y: newY })
    }

    // 초기 위치 조정
    setTimeout(adjustPosition, 100)
  }, [position])

  // 드래그 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const popup = popupRef.current
    if (!popup) return

    const rect = popup.getBoundingClientRect()
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const popupWidth = 480 // 팝업 너비
    const popupHeight = 600 // 대략적인 팝업 높이

    let newX = e.clientX - dragOffset.x
    let newY = e.clientY - dragOffset.y

    // 경계 체크
    if (newX < 20) newX = 20
    if (newX + popupWidth > viewportWidth - 20) newX = viewportWidth - popupWidth - 20
    if (newY < 20) newY = 20
    if (newY + popupHeight > viewportHeight - 100) newY = viewportHeight - popupHeight - 100

    setCurrentPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 드래그 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isDragging, dragOffset])

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // 날짜 포맷팅 함수
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return '미정'
    return date.toLocaleDateString('ko-KR')
  }

  // 저장 함수
  const handleSave = async () => {
    setIsLoading(true)
    try {
      const updateData = {
        start: editData.startDate ? new Date(editData.startDate) : task.start,
        end: editData.endDate ? new Date(editData.endDate) : task.end,
        percentComplete: editData.percentComplete,
        resource: editData.resource
      }

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()
      
      // 부모 컴포넌트에 업데이트 알림
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask)
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Error updating task:', error)
      alert('작업 저장 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 취소 함수
  const handleCancel = () => {
    // 원래 값으로 되돌리기
    setEditData({
      startDate: task.start ? task.start.toISOString().split('T')[0] : '',
      endDate: task.end ? task.end.toISOString().split('T')[0] : '',
      percentComplete: task.percentComplete || 0,
      resource: task.resource || ''
    })
    setIsEditing(false)
  }

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className={styles.taskDetailOverlay}
        onClick={onClose}
      />
      
      {/* 팝업 내용 */}
      <div 
        ref={popupRef}
        className={`${styles.taskDetailPopup} ${styles.popupDraggable}`}
        style={
          {
            '--popup-x': `${currentPosition.x}px`,
            '--popup-y': `${currentPosition.y}px`,
          } as React.CSSProperties
        }
      >
        {/* 드래그 가능한 헤더 */}
        <div 
          className={`${styles.dragHandle} flex justify-between items-center mb-4 p-2 -m-2 rounded-t cursor-move`}
          onMouseDown={handleMouseDown}
        >
          <h3 className="text-lg font-semibold text-gray-900 pointer-events-none">
            📋 작업 상세 정보 {isEditing && '(편집 모드)'}
          </h3>
          <div className="flex gap-2 pointer-events-auto">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                ✏️ 편집
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
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
          
          {/* 편집 가능한 필드들 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">시작일</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editData.startDate}
                  onChange={(e) => setEditData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="시작일을 선택하세요"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(task.start)}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">종료일</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editData.endDate}
                  onChange={(e) => setEditData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="종료일을 선택하세요"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(task.end)}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">진행률</label>
            {isEditing ? (
              <div className="mt-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editData.percentComplete}
                  onChange={(e) => setEditData(prev => ({ ...prev, percentComplete: parseInt(e.target.value) }))}
                  className="w-full"
                  title="진행률을 조정하세요"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0%</span>
                  <span className="font-medium text-gray-800">{editData.percentComplete}%</span>
                  <span>100%</span>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.taskDetailProgressContainer}>
                  <div 
                    className={styles.taskDetailProgressFill}
                    // eslint-disable-next-line react/forbid-dom-props
                    style={
                      {
                        '--progress-width': `${task.percentComplete || 0}%`
                      } as React.CSSProperties
                    }
                  />
                </div>
                <p className="text-sm text-gray-700 mt-1">{task.percentComplete || 0}% 완료</p>
              </>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">담당자</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.resource}
                onChange={(e) => setEditData(prev => ({ ...prev, resource: e.target.value }))}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="담당자명을 입력하세요"
                title="담당자명을 입력하세요"
              />
            ) : (
              <p className="text-sm text-gray-900 mt-1">{task.resource || '미정'}</p>
            )}
          </div>

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
        
        {/* 편집 모드 버튼들 */}
        {isEditing && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? '저장 중...' : '💾 저장'}
            </button>
          </div>
        )}
        
        {!isEditing && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">💡 팁: 편집 버튼을 클릭하여 작업 정보를 수정할 수 있습니다.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default TaskDetailPopup

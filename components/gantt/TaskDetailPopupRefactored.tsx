import React, { useState, useEffect, useRef } from 'react'
import { Task } from '../../types/task'
import styles from '../../styles/task-detail-popup.module.css'
import DeleteConfirmationPopup from './DeleteConfirmationPopup'
import PopupHeader from './popup/PopupHeader'
import TaskInfoDisplay from './popup/TaskInfoDisplay'
import TaskEditForm from './popup/TaskEditForm'
import { usePopupPosition } from '../../hooks/popup/usePopupPosition'
import { useDragHandler } from '../../hooks/popup/useDragHandler'
import { useTaskApi } from '../../hooks/popup/useTaskApi'

interface TaskDetailPopupProps {
  task: Task
  position: { x: number; y: number }
  onClose: () => void
  onTaskUpdate?: (updatedTask: Task) => void
  onDataRefresh?: () => void // 전체 데이터 다시 로드 함수
  onTaskDelete?: (taskId: string) => void // 작업 삭제 콜백
}

interface TaskEditData {
  name: string
  startDate: string
  endDate: string
  percentComplete: number
  resource: string
  department: string
  majorCategory: string
  middleCategory: string
  minorCategory: string
}

const TaskDetailPopupRefactored: React.FC<TaskDetailPopupProps> = ({
  task,
  position,
  onClose,
  onTaskUpdate,
  onDataRefresh,
  onTaskDelete
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  
  const [editData, setEditData] = useState<TaskEditData>({
    name: '',
    startDate: '',
    endDate: '',
    percentComplete: 0,
    resource: '',
    department: '',
    majorCategory: '',
    middleCategory: '',
    minorCategory: ''
  })

  // 커스텀 훅들 사용
  const { currentPosition, updatePosition } = usePopupPosition({
    initialPosition: position,
    popupRef
  })

  const { handleMouseDown } = useDragHandler({
    onPositionChange: updatePosition
  })

  const { isLoading, saveTask, deleteTask } = useTaskApi({
    onTaskUpdate,
    onDataRefresh
  })

  // Initialize edit data
  useEffect(() => {
    setEditData({
      name: task.name || '',
      startDate: task.start ? task.start.toISOString().split('T')[0] : '',
      endDate: task.end ? task.end.toISOString().split('T')[0] : '',
      percentComplete: task.percentComplete || 0,
      resource: task.resource || '',
      department: task.department || '',
      majorCategory: task.majorCategory || '',
      middleCategory: task.middleCategory || '',
      minorCategory: task.minorCategory || ''
    })
  }, [task])

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

  // 저장 함수
  const handleSave = async () => {
    try {
      await saveTask(task, editData)
      setIsEditing(false)
    } catch (error) {
      // 에러는 useTaskApi에서 처리됨
    }
  }

  // 취소 함수
  const handleCancel = () => {
    // 원래 값으로 되돌리기
    setEditData({
      name: task.name || '',
      startDate: task.start ? task.start.toISOString().split('T')[0] : '',
      endDate: task.end ? task.end.toISOString().split('T')[0] : '',
      percentComplete: task.percentComplete || 0,
      resource: task.resource || '',
      department: task.department || '',
      majorCategory: task.majorCategory || '',
      middleCategory: task.middleCategory || '',
      minorCategory: task.minorCategory || ''
    })
    setIsEditing(false)
  }

  // 삭제 함수
  const handleDelete = async (password: string) => {
    try {
      await deleteTask(task, password, onTaskDelete)
      setShowDeleteConfirmation(false)
      onClose()
    } catch (error) {
      // 에러는 useTaskApi에서 처리됨
    }
  }

  const isEditableTask = task.level === 2 || (!task.isGroup && !task.hasChildren)

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
        {/* 헤더 */}
        <PopupHeader
          task={task}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onDelete={() => setShowDeleteConfirmation(true)}
          onClose={onClose}
          onMouseDown={handleMouseDown}
        />
        
        {/* 내용 영역 */}
        <div className="max-h-96 overflow-y-auto">
          {isEditing ? (
            <TaskEditForm
              editData={editData}
              onEditDataChange={setEditData}
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          ) : (
            <TaskInfoDisplay task={task} />
          )}
        </div>
        
        {/* 하단 팁 */}
        {!isEditing && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            {isEditableTask ? (
              <p className="text-xs text-gray-500">💡 팁: 편집 또는 삭제 버튼을 클릭하여 작업을 관리할 수 있습니다.</p>
            ) : (
              <p className="text-xs text-gray-500">📋 그룹 항목은 편집할 수 없습니다. 개별 작업만 편집 가능합니다.</p>
            )}
          </div>
        )}
      </div>

      {/* 삭제 확인 팝업 */}
      <DeleteConfirmationPopup
        task={task}
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </>
  )
}

export default TaskDetailPopupRefactored

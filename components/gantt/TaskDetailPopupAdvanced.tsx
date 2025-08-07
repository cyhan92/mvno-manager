import React, { useState, useRef } from 'react'
import { Task } from '../../types/task'
import DeleteConfirmationPopup from './DeleteConfirmationPopup'
import PopupHeader from './popup/PopupHeader'
import { usePopupPosition } from '../../hooks/popup/usePopupPosition'
import { useDragHandler } from '../../hooks/popup/useDragHandler'
import { useTaskApi } from '../../hooks/popup/useTaskApi'
import { useTaskEditForm } from '../../hooks/popup/useTaskEditForm'

// 필드 컴포넌트들
import TextInputField from './popup/fields/TextInputField'
import DateInputField from './popup/fields/DateInputField'
import ProgressSliderField from './popup/fields/ProgressSliderField'
import CategoryEditor from './popup/fields/CategoryEditor'
import DisplayField from './popup/fields/DisplayField'

interface TaskDetailPopupProps {
  task: Task
  position: { x: number; y: number }
  onClose: () => void
  onTaskUpdate?: (updatedTask: Task) => void
  onDataRefresh?: () => void
  onTaskDelete?: (taskId: string) => void
}

const TaskDetailPopupAdvanced: React.FC<TaskDetailPopupProps> = ({
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

  const {
    editData,
    updateField,
    updateProgress,
    updateMajorCategory,
    updateMiddleCategory,
    updateMinorCategory,
    resetForm,
    isValid
  } = useTaskEditForm({ task, isEditing })

  // 편집 가능한 작업인지 확인
  const isEditableTask = task.level === 2 || (!task.isGroup && !task.hasChildren)

  // 저장 함수
  const handleSave = async () => {
    if (!isValid()) {
      alert('필수 필드를 모두 입력해주세요.')
      return
    }

    try {
      await saveTask(task, editData)
      setIsEditing(false)
      alert('작업이 성공적으로 저장되었습니다!')
    } catch (error) {
      console.error('저장 실패:', error)
    }
  }

  // 취소 함수
  const handleCancel = () => {
    resetForm()
    setIsEditing(false)
  }

  // 삭제 함수
  const handleDelete = async (password: string) => {
    try {
      await deleteTask(task, password)
      if (onTaskDelete) {
        onTaskDelete(task.id)
      }
      onClose()
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  // 날짜 포맷팅 함수
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return '미정'
    return date.toLocaleDateString('ko-KR')
  }

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose} />
      
      {/* 팝업 */}
      <div
        ref={popupRef}
        className="fixed bg-white rounded-lg shadow-xl border-2 border-gray-200 z-50 max-w-md w-full"
        style={{
          transform: `translate(${currentPosition.x}px, ${currentPosition.y}px)`
        }}
      >
        {/* 헤더 */}
        <div 
          className="bg-gray-50 px-4 py-3 rounded-t-lg border-b border-gray-200 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              📋 작업 상세정보
            </h3>
            <div className="flex gap-2">
              {!isEditing && isEditableTask && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    ✏️ 편집
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    🗑️ 삭제
                  </button>
                </>
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
        </div>
        
        {/* 컨텐츠 */}
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* 작업명 (읽기 전용) */}
          <DisplayField
            label="작업명"
            value={task.name || task.detail || '작업명 없음'}
            valueClassName="text-base font-semibold text-gray-900 mt-1"
          />

          {/* 세부업무명 */}
          {isEditing ? (
            <TextInputField
              label="세부업무명"
              value={editData.name}
              onChange={(value) => updateField('name', value)}
              placeholder="세부업무명을 입력하세요"
              required
            />
          ) : (
            <DisplayField label="세부업무명" value={task.name} />
          )}

          {/* 날짜 필드들 */}
          <div className="grid grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <DateInputField
                  label="시작일"
                  value={editData.startDate}
                  onChange={(value) => updateField('startDate', value)}
                  required
                />
                <DateInputField
                  label="종료일"
                  value={editData.endDate}
                  onChange={(value) => updateField('endDate', value)}
                  required
                />
              </>
            ) : (
              <>
                <DisplayField label="시작일" value={formatDate(task.start)} />
                <DisplayField label="종료일" value={formatDate(task.end)} />
              </>
            )}
          </div>

          {/* 진행률 */}
          {isEditing ? (
            <ProgressSliderField
              label="진행률"
              value={editData.percentComplete}
              onChange={updateProgress}
            />
          ) : (
            <DisplayField 
              label="진행률" 
              value={`${task.percentComplete || 0}% 완료`} 
            />
          )}

          {/* 담당자 */}
          {isEditing ? (
            <TextInputField
              label="담당자"
              value={editData.resource}
              onChange={(value) => updateField('resource', value)}
              placeholder="담당자명을 입력하세요"
            />
          ) : (
            <DisplayField label="담당자" value={task.resource} />
          )}

          {/* 부서 */}
          {isEditing ? (
            <TextInputField
              label="부서"
              value={editData.department}
              onChange={(value) => updateField('department', value)}
              placeholder="부서명을 입력하세요"
            />
          ) : (
            <DisplayField label="부서" value={task.department} />
          )}

          {/* 카테고리 */}
          {(task.majorCategory || task.middleCategory || task.minorCategory) && (
            <>
              {isEditing ? (
                <CategoryEditor
                  majorCategory={editData.majorCategory}
                  middleCategory={editData.middleCategory}
                  minorCategory={editData.minorCategory}
                  onMajorChange={updateMajorCategory}
                  onMiddleChange={updateMiddleCategory}
                  onMinorChange={updateMinorCategory}
                />
              ) : (
                <DisplayField
                  label="카테고리"
                  value={[task.majorCategory, task.middleCategory, task.minorCategory]
                    .filter(Boolean)
                    .join(' > ')}
                />
              )}
            </>
          )}

          {/* 상태 */}
          {task.status && (
            <DisplayField label="상태" value={task.status} />
          )}
        </div>
        
        {/* 편집 모드 버튼들 */}
        {isEditing && (
          <div className="px-4 py-3 border-t border-gray-200 flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !isValid()}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? '저장 중...' : '💾 저장'}
            </button>
          </div>
        )}
        
        {/* 비편집 모드 팁 */}
        {!isEditing && (
          <div className="px-4 py-3 border-t border-gray-200">
            {isEditableTask ? (
              <p className="text-xs text-gray-500">
                💡 팁: 편집 또는 삭제 버튼을 클릭하여 작업을 관리할 수 있습니다.
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                📋 그룹 항목은 편집할 수 없습니다. 개별 작업만 편집 가능합니다.
              </p>
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

export default TaskDetailPopupAdvanced

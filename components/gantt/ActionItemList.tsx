import React, { useState } from 'react'
import { Task, TreeState } from '../../types/task'
import { styles } from '../../styles'
import { useActionItemPopups } from '../../hooks/gantt/useActionItemPopups'
import { useActionItemHandlers } from '../../hooks/gantt/useActionItemHandlers'
import ActionItemRow from './ActionItemRow'
import ActionItemPopups from './ActionItemPopups'

interface ActionItemListProps {
  displayTasks: Task[]
  treeState: TreeState
  onTaskSelect: (task: Task) => void
  onTaskDoubleClick: (task: Task, event: React.MouseEvent) => void
  onTreeToggle: (nodeId: string) => void
  scrollRef: React.RefObject<HTMLDivElement | null>
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
  showAssigneeInfo: boolean
  onTaskAdd?: (newTask: Partial<Task>) => Promise<void>
  onMajorCategoryUpdate?: (oldCategory: string, newCategory: string) => Promise<void>
  onSubCategoryUpdate?: (taskId: string, middleCategory: string, subCategory: string, currentMiddleCategory?: string, currentSubCategory?: string) => Promise<void>
  onTaskUpdate?: (updatedTask: Task) => void
  onTaskDelete?: (taskId: string) => Promise<void>
  onDataRefresh?: () => void
  onOpenTaskDetailPopup?: (task: Task, position: { x: number; y: number }) => void
  onMoveMajorCategory?: (currentMajorCategory: string, currentMinorCategory: string, targetMajorCategory: string) => Promise<{ success: boolean; updatedCount: number }>
}

const ActionItemList: React.FC<ActionItemListProps> = ({
  displayTasks,
  treeState,
  onTaskSelect,
  onTaskDoubleClick,
  onTreeToggle,
  scrollRef,
  onScroll,
  showAssigneeInfo,
  onTaskAdd,
  onMajorCategoryUpdate,
  onSubCategoryUpdate,
  onTaskUpdate,
  onTaskDelete,
  onDataRefresh,
  onOpenTaskDetailPopup,
  onMoveMajorCategory
}) => {
  // 팝업 상태 관리
  const { popupStates, popupSetters } = useActionItemPopups()

  // 이벤트 핸들러 관리
  const handlers = useActionItemHandlers({
    popupStates,
    popupSetters,
    onTaskAdd,
    onSubCategoryUpdate,
    onOpenTaskDetailPopup,
    onMoveMajorCategory
  })

  // 추가적인 상태들 (기존 코드에서 누락된 부분들)
  const [addSubCategoryPopup, setAddSubCategoryPopup] = useState<{
    isOpen: boolean
    task: Task | null
  }>({
    isOpen: false,
    task: null
  })

  // 추가적인 핸들러들
  const handleCloseAddSubCategoryPopup = () => {
    setAddSubCategoryPopup({
      isOpen: false,
      task: null
    })
  }

  const handleAddMajorCategory = async (newCategory: string): Promise<void> => {
    // 대분류 추가 로직 구현
    // 실제 구현은 나중에 추가
  }

  const handleMajorCategoryUpdate = async (oldCategory: string, newCategory: string) => {
    if (onMajorCategoryUpdate) {
      try {
        await onMajorCategoryUpdate(oldCategory, newCategory)
      } catch (error) {
        console.error(`❌ 상위 함수 호출 실패:`, error)
        throw error
      }
    } else {
      console.warn(`⚠️ onMajorCategoryUpdate 함수가 전달되지 않았습니다`)
    }
  }

  const handleAddSubCategory = () => {
    // 컨텍스트 메뉴에서 선택된 Task를 기반으로 중분류/소분류 추가 팝업 열기
    if (popupStates.contextMenu.task) {
      setAddSubCategoryPopup({
        isOpen: true,
        task: popupStates.contextMenu.task
      })
      // 컨텍스트 메뉴 닫기
      handlers.handleCloseContextMenu()
    }
  }

  const handleConfirmDelete = async () => {
    if (popupStates.deleteConfirmationPopup.task && onTaskDelete) {
      try {
        // 로딩 상태 시작
        popupSetters.setDeleteConfirmationPopup(prev => ({
          ...prev,
          isLoading: true
        }))

        // 작업 삭제 (useTaskManager에서 이미 부분 리프레시 처리됨)
        await onTaskDelete(popupStates.deleteConfirmationPopup.task.id)
        handlers.handleCloseDeleteConfirmationPopup()
        
      } catch (error) {
        console.error('작업 삭제 실패:', error)
        alert(`작업 삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
        // 로딩 상태 종료
        popupSetters.setDeleteConfirmationPopup(prev => ({
          ...prev,
          isLoading: false
        }))
      }
    }
  }

  // 핸들러들을 통합
  const allHandlers = {
    ...handlers,
    handleCloseAddSubCategoryPopup,
    handleAddMajorCategory,
    handleMajorCategoryUpdate,
    handleAddSubCategory,
    handleConfirmDelete
  }

  return (
    <div className={`${styles.actionItemArea} flex-shrink-0`}>
      <div className={styles.actionItemHeader}>
        <h4 className="font-semibold text-gray-700">📋 Action Items</h4>
      </div>
      <div 
        ref={scrollRef}
        className={`${styles.actionItemList} ${styles.actionItemListDynamic}`}
        onScroll={onScroll}
      >
        {displayTasks.map((task, index) => (
          <ActionItemRow
            key={task.id}
            task={task}
            index={index}
            treeState={treeState}
            showAssigneeInfo={showAssigneeInfo}
            onTaskSelect={onTaskSelect}
            onTaskDoubleClick={onTaskDoubleClick}
            onTreeToggle={onTreeToggle}
            onContextMenu={handlers.handleContextMenu}
          />
        ))}
      </div>

      {/* 모든 팝업들 */}
      <ActionItemPopups
        popupStates={popupStates}
        displayTasks={displayTasks}
        handlers={allHandlers}
        addSubCategoryPopup={addSubCategoryPopup}
      />
    </div>
  )
}

export default ActionItemList

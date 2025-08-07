import React, { useState } from 'react'
import { Task } from '../../types/task'
import { getTreeIcon, TreeNode } from '../../utils/tree'
import { TreeState } from '../../types/task'
import { styles } from '../../styles'
import ContextMenu from './ContextMenu'
import AddActionItemPopupRefactored from './AddActionItemPopupRefactored'
import EditMajorCategoryPopup from './EditMajorCategoryPopup'
import SubCategoryEditPopup from './SubCategoryEditPopup'

interface ActionItemListProps {
  displayTasks: Task[]
  treeState: TreeState
  onTaskSelect: (task: Task) => void
  onTaskDoubleClick: (task: Task, event: React.MouseEvent) => void
  onTreeToggle: (nodeId: string) => void
  scrollRef: React.RefObject<HTMLDivElement | null>
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
  showAssigneeInfo: boolean // 담당자 정보 표시 여부
  onTaskAdd?: (newTask: Partial<Task>) => void // 새로운 Task 추가 콜백
  onMajorCategoryUpdate?: (oldCategory: string, newCategory: string) => Promise<void> // 대분류 수정 콜백
  onSubCategoryUpdate?: (taskId: string, middleCategory: string, subCategory: string, currentMiddleCategory?: string, currentSubCategory?: string) => Promise<void> // 중분류,소분류 수정 콜백
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
  onSubCategoryUpdate
}) => {
  // 컨텍스트 메뉴 상태
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean
    position: { x: number; y: number }
    task: Task | null
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    task: null
  })

  // Add Action Item 팝업 상태
  const [addPopup, setAddPopup] = useState<{
    isOpen: boolean
    position: { x: number; y: number }
    parentTask: Task | null
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    parentTask: null
  })

  // Edit Major Category 팝업 상태
  const [editMajorCategoryPopup, setEditMajorCategoryPopup] = useState<{
    isOpen: boolean
    position: { x: number; y: number }
    task: Task | null
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    task: null
  })

  // Edit Sub Category 팝업 상태
  const [editSubCategoryPopup, setEditSubCategoryPopup] = useState<{
    isOpen: boolean
    task: Task | null
  }>({
    isOpen: false,
    task: null
  })

  // 우클릭 이벤트 핸들러
  const handleContextMenu = (e: React.MouseEvent, task: Task) => {
    e.preventDefault()
    
    // 대분류(level 0)나 소분류(level 1)에서 컨텍스트 메뉴 표시
    if ((task.level === 0 || task.level === 1) && task.hasChildren) {
      setContextMenu({
        isOpen: true,
        position: { x: e.clientX, y: e.clientY },
        task
      })
    }
  }

  // 컨텍스트 메뉴 닫기
  const handleCloseContextMenu = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      task: null
    })
  }

  // Add Action Item 팝업 열기
  const handleOpenAddPopup = () => {
    if (contextMenu.task) {
      setAddPopup({
        isOpen: true,
        position: { x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 300 },
        parentTask: contextMenu.task
      })
    }
  }

  // Add Action Item 팝업 닫기
  const handleCloseAddPopup = () => {
    setAddPopup({
      isOpen: false,
      position: { x: 0, y: 0 },
      parentTask: null
    })
  }

  // Edit Major Category 팝업 열기
  const handleOpenEditMajorCategoryPopup = () => {
    if (contextMenu.task) {
      setEditMajorCategoryPopup({
        isOpen: true,
        position: { x: window.innerWidth / 2 - 250, y: window.innerHeight / 2 - 200 },
        task: contextMenu.task
      })
    }
  }

  // Edit Major Category 팝업 닫기
  const handleCloseEditMajorCategoryPopup = () => {
    setEditMajorCategoryPopup({
      isOpen: false,
      position: { x: 0, y: 0 },
      task: null
    })
  }

  // Edit Sub Category 팝업 열기
  const handleEditSubCategory = () => {
    console.log(`🎯 ActionItemList: handleEditSubCategory 호출`)
    console.log(`📋 선택된 태스크:`, contextMenu.task)
    console.log(`📋 태스크 상세 정보:`, {
      id: contextMenu.task?.id,
      name: contextMenu.task?.name,
      middleCategory: contextMenu.task?.middleCategory,
      minorCategory: contextMenu.task?.minorCategory,
      majorCategory: contextMenu.task?.majorCategory,
      level: contextMenu.task?.level,
      isGroup: contextMenu.task?.isGroup
    })
    
    if (contextMenu.task) {
      setEditSubCategoryPopup({
        isOpen: true,
        task: contextMenu.task
      })
    }
  }

  // Edit Sub Category 팝업 닫기
  const handleCloseEditSubCategoryPopup = () => {
    setEditSubCategoryPopup({
      isOpen: false,
      task: null
    })
  }

  // 중분류,소분류 수정 핸들러
  const handleSubCategoryUpdate = async (taskId: string, middleCategory: string, subCategory: string, currentMiddleCategory?: string, currentSubCategory?: string) => {
    console.log(`🎯 ActionItemList: handleSubCategoryUpdate 호출`)
    console.log(`📋 파라미터:`, { taskId, middleCategory, subCategory, currentMiddleCategory, currentSubCategory })
    console.log(`🔗 onSubCategoryUpdate 함수 존재:`, !!onSubCategoryUpdate)
    
    if (onSubCategoryUpdate) {
      try {
        console.log(`🚀 상위 onSubCategoryUpdate 함수 호출`)
        // onSubCategoryUpdate 함수가 5개 파라미터를 받도록 수정이 필요할 수 있음
        await onSubCategoryUpdate(taskId, middleCategory, subCategory, currentMiddleCategory, currentSubCategory)
        console.log(`✅ 상위 함수 호출 완료`)
        // 성공시 팝업 닫기
        handleCloseEditSubCategoryPopup()
      } catch (error) {
        console.error('❌ 중분류,소분류 수정 실패:', error)
      }
    } else {
      console.warn(`⚠️ onSubCategoryUpdate 함수가 전달되지 않았습니다`)
    }
  }

  // 새로운 Task 추가 핸들러
  const handleAddTask = (newTask: Partial<Task>) => {
    if (onTaskAdd) {
      onTaskAdd(newTask)
    }
  }

  // 중분류,소분류 추가 핸들러
  const handleOpenAddSubCategoryPopup = () => {
    if (contextMenu.task) {
      setEditSubCategoryPopup({
        isOpen: true,
        task: contextMenu.task
      })
    }
  }

  // 새로운 SubCategory 상태 (추가 모드용)
  const [addSubCategoryPopup, setAddSubCategoryPopup] = useState<{
    isOpen: boolean
    task: Task | null
  }>({
    isOpen: false,
    task: null
  })

  // 중분류,소분류 추가 팝업 열기
  const handleOpenAddSubCategoryPopupForNew = () => {
    if (contextMenu.task) {
      setAddSubCategoryPopup({
        isOpen: true,
        task: contextMenu.task
      })
    }
  }

  // 중분류,소분류 추가 팝업 닫기
  const handleCloseAddSubCategoryPopup = () => {
    setAddSubCategoryPopup({
      isOpen: false,
      task: null
    })
  }

  // 대분류 수정 핸들러
  const handleMajorCategoryUpdate = async (oldCategory: string, newCategory: string) => {
    console.log(`🎯 ActionItemList: handleMajorCategoryUpdate 호출`)
    console.log(`📋 파라미터:`, { oldCategory, newCategory })
    console.log(`🔗 onMajorCategoryUpdate 함수 존재:`, !!onMajorCategoryUpdate)
    
    if (onMajorCategoryUpdate) {
      try {
        console.log(`🚀 상위 onMajorCategoryUpdate 함수 호출`)
        await onMajorCategoryUpdate(oldCategory, newCategory)
        console.log(`✅ 상위 함수 호출 완료`)
      } catch (error) {
        console.error(`❌ 상위 함수 호출 실패:`, error)
        throw error
      }
    } else {
      console.warn(`⚠️ onMajorCategoryUpdate 함수가 전달되지 않았습니다`)
    }
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
          <div 
            key={task.id}
            className={`${styles.actionItemRow} ${
              index % 2 === 0 ? styles.actionItemRowEven : styles.actionItemRowOdd
            } ${task.hasChildren ? styles.actionItemRowGroup : styles.actionItemRowLeaf} ${
              styles[`treeLevel${task.level || 0}`]
            }`}
            onClick={() => {
              if (task.hasChildren) {
                // 자식이 있는 경우 확대/축소
                onTreeToggle(task.id)
              } else {
                // 자식이 없는 경우 작업 선택
                onTaskSelect(task)
              }
            }}
            onDoubleClick={(e) => onTaskDoubleClick(task, e)}
            onContextMenu={(e) => handleContextMenu(e, task)}
          >
            <div className={styles.treeNode}>
              {/* 토글 버튼 또는 빈 공간 */}
              {task.hasChildren ? (
                <div 
                  className={styles.treeToggle}
                  onClick={(e) => {
                    e.stopPropagation()
                    onTreeToggle(task.id)
                  }}
                >
                  {treeState.isExpanded(task.id) ? '−' : '+'}
                </div>
              ) : (
                <div className={styles.treeToggleEmpty} />
              )}
              
              {/* 아이콘 */}
              <span className={styles.treeIcon}>
                {getTreeIcon(task as TreeNode, treeState.isExpanded(task.id))}
              </span>
              
              {/* 텍스트 */}
              <div className={styles.treeText}>
                <span className={task.percentComplete === 100 ? 'text-gray-400' : ''}>
                  {/* 소분류는 이미 "[중분류] 소분류" 형식으로 빌드됨 */}
                  {(() => {
                    const taskName = task.name || task.detail || `작업 ${index + 1}`
                    
                    // level 1 (소분류)이고 "[중분류] 소분류" 형식인 경우 스타일링 적용
                    if (task.level === 1 && taskName.match(/^\[([^\]]+)\]\s*(.*)/)) {
                      const middleCategoryMatch = taskName.match(/^\[([^\]]+)\]\s*(.*)/)
                      if (middleCategoryMatch) {
                        const [, middleCategory, remainingName] = middleCategoryMatch
                        return (
                          <>
                            <span className="text-xs text-gray-500">[{middleCategory}]</span>
                            <span className="ml-1">{remainingName}</span>
                          </>
                        )
                      }
                    }
                    
                    return taskName
                  })()}
                </span>
                {/* 담당자 정보 표시 (세부업무만) */}
                {showAssigneeInfo && !task.hasChildren && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({task.department || '미정'}/{task.resource || '미정'})
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 컨텍스트 메뉴 */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        task={contextMenu.task}
        onClose={handleCloseContextMenu}
        onAddActionItem={handleOpenAddPopup}
        onEditMajorCategory={handleOpenEditMajorCategoryPopup}
        onEditSubCategory={handleEditSubCategory}
        onAddSubCategory={handleOpenAddSubCategoryPopupForNew}
      />

      {/* Add Action Item 팝업 */}
      {addPopup.parentTask && (
        <AddActionItemPopupRefactored
          isOpen={addPopup.isOpen}
          position={addPopup.position}
          parentTask={addPopup.parentTask}
          onClose={handleCloseAddPopup}
          onAdd={handleAddTask}
        />
      )}

      {/* Edit Major Category 팝업 */}
      {editMajorCategoryPopup.task && (
        <EditMajorCategoryPopup
          isOpen={editMajorCategoryPopup.isOpen}
          position={editMajorCategoryPopup.position}
          task={editMajorCategoryPopup.task}
          onClose={handleCloseEditMajorCategoryPopup}
          onSave={handleMajorCategoryUpdate}
        />
      )}

      {/* Edit Sub Category 팝업 */}
      {editSubCategoryPopup.task && (
        <SubCategoryEditPopup
          isOpen={editSubCategoryPopup.isOpen}
          task={editSubCategoryPopup.task}
          currentMiddleCategory={editSubCategoryPopup.task.middleCategory}
          currentSubCategory={editSubCategoryPopup.task.minorCategory}
          onClose={handleCloseEditSubCategoryPopup}
          onUpdateSubCategory={handleSubCategoryUpdate}
          mode="edit"
        />
      )}

      {/* Add Sub Category 팝업 */}
      {addSubCategoryPopup.task && (
        <SubCategoryEditPopup
          isOpen={addSubCategoryPopup.isOpen}
          task={addSubCategoryPopup.task}
          currentMiddleCategory={addSubCategoryPopup.task.middleCategory}
          currentSubCategory=""
          onClose={handleCloseAddSubCategoryPopup}
          onUpdateSubCategory={handleSubCategoryUpdate}
          mode="add"
          onAddTask={handleAddTask}
        />
      )}
    </div>
  )
}

export default ActionItemList

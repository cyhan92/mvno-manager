import React from 'react'
import { Task } from '../../types/task'
import { getTreeIcon, TreeNode } from '../../utils/tree'
import { TreeState } from '../../types/task'
import { styles } from '../../styles'

interface ActionItemListProps {
  displayTasks: Task[]
  treeState: TreeState
  onTaskSelect: (task: Task) => void
  onTaskDoubleClick: (task: Task, event: React.MouseEvent) => void
  onTreeToggle: (nodeId: string) => void
  scrollRef: React.RefObject<HTMLDivElement | null>
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
  showAssigneeInfo: boolean // 담당자 정보 표시 여부
}

const ActionItemList: React.FC<ActionItemListProps> = ({
  displayTasks,
  treeState,
  onTaskSelect,
  onTaskDoubleClick,
  onTreeToggle,
  scrollRef,
  onScroll,
  showAssigneeInfo
}) => {
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
                  {/* 중분류와 소분류를 분리해서 표시 */}
                  {(() => {
                    const taskName = task.name || task.detail || `작업 ${index + 1}`
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
    </div>
  )
}

export default ActionItemList

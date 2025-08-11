import React from 'react'
import { Task, TreeState } from '../../types/task'
import { getTreeIcon, TreeNode } from '../../utils/tree'
import { styles } from '../../styles'

interface ActionItemRowProps {
  task: Task
  index: number
  treeState: TreeState
  showAssigneeInfo: boolean
  onTaskSelect: (task: Task) => void
  onTaskDoubleClick: (task: Task, event: React.MouseEvent) => void
  onTreeToggle: (nodeId: string) => void
  onContextMenu: (e: React.MouseEvent, task: Task) => void
}

const ActionItemRow: React.FC<ActionItemRowProps> = ({
  task,
  index,
  treeState,
  showAssigneeInfo,
  onTaskSelect,
  onTaskDoubleClick,
  onTreeToggle,
  onContextMenu
}) => {
  return (
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
      onContextMenu={(e) => onContextMenu(e, task)}
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
          <span 
            className={`${styles.treeTextSmall} ${task.percentComplete === 100 ? 'text-gray-400' : ''}`}
          >
            {(() => {
              const taskName = task.name || task.detail || `작업 ${index + 1}`
              
              // level 1 (소분류): middleCategory와 minorCategory를 조합하여 표시
              if (task.level === 1) {
                const middleCategory = task.middleCategory || ''
                const minorCategory = task.minorCategory || taskName
                
                if (middleCategory) {
                  return (
                    <>
                      <span className="text-xs text-gray-500">[{middleCategory}]</span>
                      <span className="ml-1">{minorCategory}</span>
                    </>
                  )
                }
                return minorCategory
              }
              
              // level 2 (상세업무): 상세업무명만 표시 (카테고리 정보 제외)
              if (task.level === 2) {
                // 세부업무명 (조직/담당자) 형태로 표시
                if (showAssigneeInfo && !task.hasChildren) {
                  const department = task.department && task.department !== '미정' ? task.department : '미정'
                  const resource = task.resource && task.resource !== '미정' ? task.resource : '미정'
                  
                  return (
                    <>
                      <span>{taskName}</span>
                      <span className="text-xs text-gray-400 ml-1 opacity-80">
                        ({department}/{resource})
                      </span>
                    </>
                  )
                }
                
                // 일반 표시 (상세업무명만)
                return taskName
              }
              
              // 기본 표시 (대분류 또는 카테고리 정보가 없는 경우)
              if (showAssigneeInfo && !task.hasChildren && task.level === 2) {
                const department = task.department && task.department !== '미정' ? task.department : '미정'
                const resource = task.resource && task.resource !== '미정' ? task.resource : '미정'
                
                return (
                  <>
                    {taskName}
                    <span className="text-xs text-gray-400 ml-1 opacity-80">
                      ({department}/{resource})
                    </span>
                  </>
                )
              }
              
              return taskName
            })()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ActionItemRow

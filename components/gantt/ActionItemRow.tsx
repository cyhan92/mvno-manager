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
              
              // 세부업무명 (조직/담당자) 형태로 표시
              if (showAssigneeInfo && !task.hasChildren) {
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

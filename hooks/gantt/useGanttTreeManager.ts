import React, { useMemo, useCallback, useRef } from 'react'
import { Task } from '../../types/task'
import { buildTaskTree, flattenTree } from '../../utils/tree'
import { useTreeState } from '../useTreeState'

interface UseGanttTreeManagerProps {
  tasks: Task[]
  onTreeStateChange?: (state: {
    expandAll: () => void
    collapseAll: () => void
    expandToLevel: (level: number) => void
  }) => void
}

export const useGanttTreeManager = ({ tasks, onTreeStateChange }: UseGanttTreeManagerProps) => {
  // 트리 구조 생성
  const taskTree = useMemo(() => {
    return buildTaskTree(tasks)
  }, [tasks])
  
  // 트리 상태 관리
  const treeState = useTreeState()

  // taskTree가 변경될 때 treeState에 전달
  React.useEffect(() => {
    if (treeState.setTreeData) {
      treeState.setTreeData(taskTree)
    }
  }, [taskTree, treeState.setTreeData])

  // 트리 상태 함수들을 부모 컴포넌트에 전달
  React.useEffect(() => {
    if (onTreeStateChange) {
      onTreeStateChange({
        expandAll: treeState.expandAll,
        collapseAll: treeState.collapseAll,
        expandToLevel: treeState.expandToLevel
      })
    }
  }, [onTreeStateChange, treeState.expandAll, treeState.collapseAll, treeState.expandToLevel])
  
  // 펼쳐진 노드만 평면화
  const flattenedTasks = useMemo(() => {
    return flattenTree(taskTree, treeState.expandedNodes)
  }, [taskTree, treeState.expandedNodes])

  return {
    taskTree,
    treeState,
    flattenedTasks
  }
}

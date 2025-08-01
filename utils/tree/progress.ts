import { Task } from '../../types/task'
import { TreeNode } from './types'

// 진행율 계산 함수 - 하위 항목들의 완료 상태를 기반으로 계산
export const calculateProgressFromChildren = (children: TreeNode[]): number => {
  if (!children || children.length === 0) return 0
  
  // 실제 작업 항목들 (level 3)의 완료 상태만 체크
  const leafTasks = getAllLeafTasks(children)
  if (leafTasks.length === 0) return 0
  
  const completedTasks = leafTasks.filter(task => task.percentComplete >= 100)
  return Math.round((completedTasks.length / leafTasks.length) * 100)
}

// 모든 하위 작업들을 재귀적으로 수집
export const getAllLeafTasks = (nodes: TreeNode[]): TreeNode[] => {
  const leafTasks: TreeNode[] = []
  
  const collect = (nodeList: TreeNode[]) => {
    nodeList.forEach(node => {
      if (node.level === 3 && !node.hasChildren) {
        // 실제 작업 항목
        leafTasks.push(node)
      } else if (node.children && node.children.length > 0) {
        // 그룹 노드의 하위 항목들을 재귀적으로 수집
        collect(node.children)
      }
    })
  }
  
  collect(nodes)
  return leafTasks
}

// 평균 진행율 계산
export const calculateAverageProgress = (items: { percentComplete: number }[]): number => {
  if (items.length === 0) return 0
  const totalProgress = items.reduce((sum, item) => sum + (item.percentComplete || 0), 0)
  return Math.round(totalProgress / items.length)
}

import { TreeNode } from './types'
import { TREE_CONFIG } from './config'

// 트리를 평면 배열로 변환 (펼쳐진 노드만)
export const flattenTree = (tree: TreeNode[], expandedNodes: Set<string>): TreeNode[] => {
  const result: TreeNode[] = []

  const traverse = (nodes: TreeNode[], depth: number = 0) => {
    nodes.forEach(node => {
      result.push(node)
      
      if (node.hasChildren && node.children && expandedNodes.has(node.id)) {
        traverse(node.children, depth + 1)
      }
    })
  }

  traverse(tree)
  return result
}

// 노드의 들여쓰기 레벨에 따른 아이콘 반환 (3단계 구조)
export const getTreeIcon = (node: TreeNode, isExpanded: boolean): string => {
  if (!node.hasChildren) {
    // 완료된 세부업무는 체크 아이콘, 미완료는 문서 아이콘
    return node.percentComplete === 100 ? '✅' : '📄'
  }
  
  switch (node.level) {
    case 0: // 대분류
      return isExpanded ? '📂' : '📁'
    case 1: // 소분류
      return isExpanded ? '📋' : '📋'
    default:
      return '📄'
  }
}

// 노드의 들여쓰기 픽셀 계산
export const getIndentPixels = (level: number): number => {
  return level * TREE_CONFIG.INDENT_SIZE
}

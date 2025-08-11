import { useState, useCallback } from 'react'
import { TreeState } from '../types/task'
import { TreeNode } from '../utils/tree/types'

export const useTreeState = (): TreeState => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [treeData, setTreeData] = useState<TreeNode[]>([])

  // 트리 데이터 설정 시 기존 확장 상태 보존
  const setTreeDataWithStatePreservation = useCallback((newTreeData: TreeNode[]) => {
    setTreeData(prevTreeData => {
      // 이전 트리 데이터가 없으면 그냥 새 데이터 설정
      if (prevTreeData.length === 0) {
        return newTreeData
      }

      // 새 트리에서 유효한 노드 ID 수집
      const getValidNodeIds = (nodes: TreeNode[]): Set<string> => {
        const ids = new Set<string>()
        const traverse = (nodeList: TreeNode[]) => {
          nodeList.forEach(node => {
            ids.add(node.id)
            if (node.children) {
              traverse(node.children)
            }
          })
        }
        traverse(nodes)
        return ids
      }

      const validNodeIds = getValidNodeIds(newTreeData)
      
      // 기존 확장 상태에서 여전히 유효한 노드들만 유지
      setExpandedNodes(prevExpanded => {
        const filteredExpanded = new Set<string>()
        prevExpanded.forEach(nodeId => {
          if (validNodeIds.has(nodeId)) {
            filteredExpanded.add(nodeId)
          }
        })
        return filteredExpanded
      })

      return newTreeData
    })
  }, [])

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }, [])

  const isExpanded = useCallback((nodeId: string) => {
    return expandedNodes.has(nodeId)
  }, [expandedNodes])

  // 모든 노드 확장
  const expandAll = useCallback(() => {
    if (treeData.length === 0) return
    
    const getAllNodeIds = (nodes: TreeNode[]): string[] => {
      const ids: string[] = []
      nodes.forEach(node => {
        if (node.hasChildren) {
          ids.push(node.id)
          if (node.children) {
            ids.push(...getAllNodeIds(node.children))
          }
        }
      })
      return ids
    }

    const allNodeIds = getAllNodeIds(treeData)
    setExpandedNodes(new Set(allNodeIds))
  }, [treeData])

  // 모든 노드 축소
  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set())
  }, [])

  // 특정 레벨까지 확장
  const expandToLevel = useCallback((level: number) => {
    if (treeData.length === 0) return
    
    const getNodeIdsToLevel = (nodes: TreeNode[], currentLevel: number = 0): string[] => {
      const ids: string[] = []
      nodes.forEach(node => {
        if (node.hasChildren && currentLevel < level) {
          ids.push(node.id)
          if (node.children) {
            ids.push(...getNodeIdsToLevel(node.children, currentLevel + 1))
          }
        }
      })
      return ids
    }

    const nodeIds = getNodeIdsToLevel(treeData)
    setExpandedNodes(new Set(nodeIds))
  }, [treeData])

  return {
    expandedNodes,
    toggleNode,
    isExpanded,
    expandAll,
    collapseAll,
    expandToLevel,
    setTreeData: setTreeDataWithStatePreservation // 상태 보존 함수 사용
  }
}

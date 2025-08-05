import { useState, useCallback } from 'react'
import { TreeState } from '../types/task'

export const useTreeState = (): TreeState => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

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

  return {
    expandedNodes,
    toggleNode,
    isExpanded
  }
}

import { useState, useCallback, useEffect } from 'react'
import { TreeState } from '../../types/task'

export const useTreeState = (): TreeState => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  // 초기에 대분류 몇 개를 자동으로 펼치기
  useEffect(() => {
    // 페이지 로드 시 첫 번째 대분류를 자동으로 펼치기
    const initialExpanded = new Set(['major_미분류']) // 기본적으로 미분류 항목 펼치기
    setExpandedNodes(initialExpanded)
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

  return {
    expandedNodes,
    toggleNode,
    isExpanded
  }
}

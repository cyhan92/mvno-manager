import { useMemo, useEffect } from 'react'
import { TreeNode } from '../utils/tree'

interface UseGanttHeightProps {
  taskTree: TreeNode[]
  displayTasks: any[]
  actionItemScrollRef: React.RefObject<HTMLDivElement | null>
  ganttChartScrollRef: React.RefObject<HTMLDivElement | null>
}

export const useGanttHeight = ({
  taskTree,
  displayTasks,
  actionItemScrollRef,
  ganttChartScrollRef
}: UseGanttHeightProps) => {
  // 초기 높이 계산 - 대분류 개수에 맞게 자동 설정
  const initialHeight = useMemo(() => {
    const baseHeight = 80 // 헤더 높이
    const rowHeight = 40 // 각 행의 높이 (간트차트 ROW_HEIGHT와 일치)
    const padding = 40 // 여유 공간
    
    // 대분류(레벨 0) 노드의 개수 계산
    const majorCategoryCount = taskTree.filter(node => node.level === 0).length
    
    // 최소 높이와 계산된 높이 중 큰 값 사용
    const calculatedHeight = baseHeight + (majorCategoryCount * rowHeight) + padding
    const minHeight = 300 // 최소 높이
    
    return Math.max(calculatedHeight, minHeight)
  }, [taskTree])

  // 동적 높이 설정 effect
  useEffect(() => {
    if (actionItemScrollRef.current && ganttChartScrollRef.current) {
      const listHeight = initialHeight - 80 // 헤더 높이 제외
      const rowHeight = 40 // ROW_HEIGHT와 일치
      const totalContentHeight = displayTasks.length * rowHeight
      const shouldScroll = totalContentHeight > listHeight
      
      // 스크롤 영역 설정
      actionItemScrollRef.current.style.height = `${listHeight}px`
      actionItemScrollRef.current.style.maxHeight = `${listHeight}px`
      actionItemScrollRef.current.style.overflowY = shouldScroll ? 'auto' : 'hidden'
      
      // Gantt Chart도 동일한 설정
      ganttChartScrollRef.current.style.height = `${listHeight}px`
      ganttChartScrollRef.current.style.maxHeight = `${listHeight}px`
      ganttChartScrollRef.current.style.overflowY = shouldScroll ? 'auto' : 'hidden'
      
  // 스크롤바 여백 보정은 useScrollSync의 헤더 패딩 동기화로 일원화 (여기서는 미적용)
  ganttChartScrollRef.current.style.paddingRight = '0'
  ganttChartScrollRef.current.style.marginRight = '0'
    }
  }, [initialHeight, displayTasks.length, actionItemScrollRef, ganttChartScrollRef])

  return {
    initialHeight
  }
}

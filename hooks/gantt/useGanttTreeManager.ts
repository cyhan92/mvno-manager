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
  scrollRefs?: {
    actionItemScrollRef: React.RefObject<HTMLDivElement | null>
    ganttChartScrollRef: React.RefObject<HTMLDivElement | null>
    headerScrollRef?: React.RefObject<HTMLDivElement | null>
  }
}

export const useGanttTreeManager = ({ tasks, onTreeStateChange, scrollRefs }: UseGanttTreeManagerProps) => {
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

  // 스크롤 인식 확장/축소 함수들을 생성
  const createScrollAwareExpandAll = useCallback(() => {
    if (!scrollRefs) {
      treeState.expandAll()
      return
    }
    
    // 현재 스크롤 위치 저장
    const currentScrollTop = scrollRefs.actionItemScrollRef.current?.scrollTop || 0
    const currentScrollLeft = scrollRefs.ganttChartScrollRef.current?.scrollLeft || 0
    
    console.log('expandAll - 스크롤 위치 저장:', { scrollTop: currentScrollTop, scrollLeft: currentScrollLeft })
    
    // 트리 확장
    treeState.expandAll()
    
    // 스크롤 위치 복원
    setTimeout(() => {
      if (scrollRefs.actionItemScrollRef.current) {
        scrollRefs.actionItemScrollRef.current.scrollTop = currentScrollTop
      }
      if (scrollRefs.ganttChartScrollRef.current) {
        scrollRefs.ganttChartScrollRef.current.scrollTop = currentScrollTop
        scrollRefs.ganttChartScrollRef.current.scrollLeft = currentScrollLeft
      }
      if (scrollRefs.headerScrollRef?.current) {
        scrollRefs.headerScrollRef.current.scrollLeft = currentScrollLeft
      }
      
      console.log('expandAll - 스크롤 위치 복원 완료')
      
      // 재검증
      setTimeout(() => {
        const ganttScrollLeft = scrollRefs.ganttChartScrollRef.current?.scrollLeft || 0
        const headerScrollLeft = scrollRefs.headerScrollRef?.current?.scrollLeft || 0
        
        if (Math.abs(ganttScrollLeft - headerScrollLeft) > 1) {
          console.log('expandAll - 스크롤 재동기화')
          if (scrollRefs.ganttChartScrollRef.current) {
            scrollRefs.ganttChartScrollRef.current.scrollLeft = currentScrollLeft
          }
          if (scrollRefs.headerScrollRef?.current) {
            scrollRefs.headerScrollRef.current.scrollLeft = currentScrollLeft
          }
        }
      }, 50)
    }, 10)
  }, [treeState.expandAll, scrollRefs?.actionItemScrollRef, scrollRefs?.ganttChartScrollRef, scrollRefs?.headerScrollRef])

  const createScrollAwareCollapseAll = useCallback(() => {
    if (!scrollRefs) {
      treeState.collapseAll()
      return
    }
    
    // 현재 스크롤 위치 저장
    const currentScrollTop = scrollRefs.actionItemScrollRef.current?.scrollTop || 0
    const currentScrollLeft = scrollRefs.ganttChartScrollRef.current?.scrollLeft || 0
    
    console.log('collapseAll - 스크롤 위치 저장:', { scrollTop: currentScrollTop, scrollLeft: currentScrollLeft })
    
    // 트리 축소
    treeState.collapseAll()
    
    // 스크롤 위치 복원
    setTimeout(() => {
      if (scrollRefs.actionItemScrollRef.current) {
        scrollRefs.actionItemScrollRef.current.scrollTop = currentScrollTop
      }
      if (scrollRefs.ganttChartScrollRef.current) {
        scrollRefs.ganttChartScrollRef.current.scrollTop = currentScrollTop
        scrollRefs.ganttChartScrollRef.current.scrollLeft = currentScrollLeft
      }
      if (scrollRefs.headerScrollRef?.current) {
        scrollRefs.headerScrollRef.current.scrollLeft = currentScrollLeft
      }
      
      console.log('collapseAll - 스크롤 위치 복원 완료')
    }, 10)
  }, [treeState.collapseAll, scrollRefs?.actionItemScrollRef, scrollRefs?.ganttChartScrollRef, scrollRefs?.headerScrollRef])

  const createScrollAwareExpandToLevel = useCallback((level: number) => {
    if (!scrollRefs) {
      treeState.expandToLevel(level)
      return
    }
    
    // 현재 스크롤 위치 저장
    const currentScrollTop = scrollRefs.actionItemScrollRef.current?.scrollTop || 0
    const currentScrollLeft = scrollRefs.ganttChartScrollRef.current?.scrollLeft || 0
    
    console.log('expandToLevel - 스크롤 위치 저장:', { level, scrollTop: currentScrollTop, scrollLeft: currentScrollLeft })
    
    // 트리 레벨 확장
    treeState.expandToLevel(level)
    
    // 스크롤 위치 복원
    setTimeout(() => {
      if (scrollRefs.actionItemScrollRef.current) {
        scrollRefs.actionItemScrollRef.current.scrollTop = currentScrollTop
      }
      if (scrollRefs.ganttChartScrollRef.current) {
        scrollRefs.ganttChartScrollRef.current.scrollTop = currentScrollTop
        scrollRefs.ganttChartScrollRef.current.scrollLeft = currentScrollLeft
      }
      if (scrollRefs.headerScrollRef?.current) {
        scrollRefs.headerScrollRef.current.scrollLeft = currentScrollLeft
      }
      
      console.log('expandToLevel - 스크롤 위치 복원 완료')
      
      // 재검증
      setTimeout(() => {
        const ganttScrollLeft = scrollRefs.ganttChartScrollRef.current?.scrollLeft || 0
        const headerScrollLeft = scrollRefs.headerScrollRef?.current?.scrollLeft || 0
        
        if (Math.abs(ganttScrollLeft - headerScrollLeft) > 1) {
          console.log('expandToLevel - 스크롤 재동기화')
          if (scrollRefs.ganttChartScrollRef.current) {
            scrollRefs.ganttChartScrollRef.current.scrollLeft = currentScrollLeft
          }
          if (scrollRefs.headerScrollRef?.current) {
            scrollRefs.headerScrollRef.current.scrollLeft = currentScrollLeft
          }
        }
      }, 50)
    }, 10)
  }, [treeState.expandToLevel, scrollRefs?.actionItemScrollRef, scrollRefs?.ganttChartScrollRef, scrollRefs?.headerScrollRef])

  // 트리 상태 함수들을 부모 컴포넌트에 전달 (스크롤 인식 버전 사용)
  React.useEffect(() => {
    if (onTreeStateChange) {
      onTreeStateChange({
        expandAll: createScrollAwareExpandAll,
        collapseAll: createScrollAwareCollapseAll,
        expandToLevel: createScrollAwareExpandToLevel
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

import { Task, ViewMode, DateUnit } from '../../types/task'
import { useCustomGanttChart } from '../useCustomGanttChart'
import { useGanttPopup } from '../useGanttPopup'
import { useGanttScroll } from '../useGanttScroll'
import { useGanttHeight } from '../useGanttHeight'
import { useGanttTreeManager } from './useGanttTreeManager'
import { useRenderTrigger } from './useRenderTrigger'
import { useSynchronizedRendering } from './useSynchronizedRendering'
import { useTreeToggleHandler } from './useTreeToggleHandler'
import { useScrollbarGutterSync } from './useScrollbarGutterSync'

interface UseGanttChartManagerProps {
  tasks: Task[]
  viewMode: ViewMode
  dateUnit: DateUnit
  groupedTasks: Record<string, Task[]>
  onTaskSelect: (selection: any) => void
  groupBy?: string
  onTreeStateChange?: (state: {
    expandAll: () => void
    collapseAll: () => void
    expandToLevel: (level: number) => void
  }) => void
}

export const useGanttChartManager = ({
  tasks,
  viewMode,
  dateUnit,
  groupedTasks,
  onTaskSelect,
  groupBy,
  onTreeStateChange
}: UseGanttChartManagerProps) => {
  // 스크롤 관리 (트리 관리보다 먼저 초기화)
  const scroll = useGanttScroll()

  // 트리 상태 관리 (스크롤 컨텍스트와 함께)
  const { taskTree, treeState, flattenedTasks } = useGanttTreeManager({
    tasks,
    onTreeStateChange,
    scrollRefs: { // 스크롤 컨텍스트 전달
      actionItemScrollRef: scroll.actionItemScrollRef,
      ganttChartScrollRef: scroll.ganttChartScrollRef,
      headerScrollRef: scroll.headerScrollRef
    }
  })

  // 렌더링 트리거 관리
  const { renderTrigger, triggerRender } = useRenderTrigger()

  // 팝업 상태 관리
  const popup = useGanttPopup()

  // 높이 관리
  useGanttHeight({
    taskTree,
    displayTasks: flattenedTasks,
    actionItemScrollRef: scroll.actionItemScrollRef,
    ganttChartScrollRef: scroll.ganttChartScrollRef
  })

  // 커스텀 간트 차트 훅
  const {
    canvasRef,
    containerRef,
    isLoading,
    displayTasks,
    handleCanvasClick,
    handleCanvasDoubleClick,
    renderChart,
    chartWidth
  } = useCustomGanttChart({
    tasks: flattenedTasks,
    viewMode,
    dateUnit,
    groupedTasks,
    onTaskSelect,
    onTaskDoubleClick: popup.openPopup,
    groupBy,
    setInitialScrollPosition: scroll.setInitialScrollPosition
  })

  // 동기화 렌더링
  useSynchronizedRendering({
    displayTasks,
    expandedNodesSize: treeState.expandedNodes.size,
    canvasRef,
    renderChart,
    triggerRender
  })

  // 세로 스크롤바 거터 동기화(헤더 오른쪽 패딩 = 차트 세로 스크롤바 폭)
  useScrollbarGutterSync({
    headerScrollRef: scroll.headerScrollRef,
    ganttChartScrollRef: scroll.ganttChartScrollRef
  })

  // 트리 토글 핸들러 (헤더 스크롤 ref 추가)
  const { handleTreeToggle } = useTreeToggleHandler({
    treeState,
    scrollRefs: {
      actionItemScrollRef: scroll.actionItemScrollRef,
      ganttChartScrollRef: scroll.ganttChartScrollRef,
      headerScrollRef: scroll.headerScrollRef // 헤더 스크롤 ref 추가
    },
    renderChart,
    triggerRender
  })

  return {
    // 트리 관련
    taskTree,
    treeState,
    flattenedTasks,
    handleTreeToggle,
    
    // 렌더링 관련
    renderTrigger,
    
    // 간트 차트 관련
    canvasRef,
    containerRef,
    isLoading,
    displayTasks,
    handleCanvasClick,
    handleCanvasDoubleClick,
    chartWidth,
    
    // 팝업 관련
    popup,
    
    // 스크롤 관련
    scroll,
    
    // 동기화된 작업 목록
    synchronizedTasks: flattenedTasks
  }
}

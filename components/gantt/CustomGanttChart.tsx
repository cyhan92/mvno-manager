'use client'
import React from 'react'
import { Task, ViewMode, DateUnit } from '../../types/task'
import { useCustomGanttChart } from '../../hooks/useCustomGanttChart'
import { useTreeState } from '../../hooks'
import { useGanttPopup } from '../../hooks/useGanttPopup'
import { useGanttScroll } from '../../hooks/useGanttScroll'
import { useGanttHeight } from '../../hooks/useGanttHeight'
import { buildTaskTree, flattenTree } from '../../utils/tree'
import ActionItemList from './ActionItemList'
import GanttHeader from './GanttHeader'
import GanttCanvas from './GanttCanvas'
import TaskDetailPopup from './TaskDetailPopup'
import EmptyState from './EmptyState'
import { styles } from '../../styles'

interface CustomGanttChartProps {
  tasks: Task[]
  viewMode: ViewMode
  dateUnit: DateUnit
  chartData: any[]
  groupedTasks: Record<string, Task[]>
  onTaskSelect: (selection: any) => void
  onTaskUpdate?: (updatedTask: Task) => void
  groupBy?: string
}

const CustomGanttChart: React.FC<CustomGanttChartProps> = ({
  tasks,
  viewMode,
  dateUnit,
  chartData,
  groupedTasks,
  onTaskSelect,
  onTaskUpdate,
  groupBy
}) => {
  const [renderTrigger, setRenderTrigger] = React.useState(0)
  
  // 팝업 상태 관리
  const popup = useGanttPopup()
  
  // 스크롤 관리
  const scroll = useGanttScroll()
  
  // 트리 상태 관리
  const treeState = useTreeState()

  // 트리 구조 생성
  const taskTree = React.useMemo(() => {
    const tree = buildTaskTree(tasks)
    return tree
  }, [tasks])
  
  // 펼쳐진 노드만 평면화
  const flattenedTasks = React.useMemo(() => {
    const flattened = flattenTree(taskTree, treeState.expandedNodes)
    return flattened
  }, [taskTree, treeState.expandedNodes])

  // 높이 관리
  useGanttHeight({
    taskTree,
    displayTasks: flattenedTasks,
    actionItemScrollRef: scroll.actionItemScrollRef,
    ganttChartScrollRef: scroll.ganttChartScrollRef
  })

  const {
    canvasRef,
    containerRef,
    isLoading,
    displayTasks,
    handleCanvasClick,
    handleCanvasDoubleClick,
    renderChart
  } = useCustomGanttChart({
    tasks: flattenedTasks, // 평면화된 트리 구조 전달
    viewMode,
    dateUnit,
    groupedTasks,
    onTaskSelect,
    onTaskDoubleClick: popup.openPopup,
    groupBy
  })

  // Action Item과 Gantt Chart에서 동일한 데이터 사용 보장
  const synchronizedTasks = flattenedTasks

  // 트리 상태가 변경될 때마다 캔버스 다시 그리기
  React.useEffect(() => {
    // 직접 캔버스를 다시 그리기
    if (canvasRef.current && displayTasks.length > 0) {
      // 약간의 딜레이를 두어 DOM 업데이트 후 렌더링
      const timer = setTimeout(() => {
        if (renderChart) {
          renderChart()
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [displayTasks, treeState.expandedNodes, renderChart, canvasRef])

  // 트리 노드 토글 핸들러
  const handleTreeToggle = (nodeId: string) => {
    // 현재 스크롤 위치 저장
    const currentScrollTop = scroll.actionItemScrollRef.current?.scrollTop || 0
    
    // 트리 상태 토글
    treeState.toggleNode(nodeId)
    
    // 헤더 재렌더링 트리거
    setRenderTrigger(prev => prev + 1)
    
    // 다음 렌더링 사이클에서 스크롤 위치 복원
    setTimeout(() => {
      if (scroll.actionItemScrollRef.current) {
        scroll.actionItemScrollRef.current.scrollTop = currentScrollTop
      }
      if (scroll.ganttChartScrollRef.current) {
        scroll.ganttChartScrollRef.current.scrollTop = currentScrollTop
      }
    }, 100)
  }

  if (!flattenedTasks || flattenedTasks.length === 0) {
    return (
      <EmptyState 
        totalTasks={tasks.length}
        treeNodesCount={taskTree.length}
        expandedNodesCount={treeState.expandedNodes.size}
      />
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className={`flex justify-between items-center mb-4 ${styles.ganttHeader}`}>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            📊 프로젝트 간트 차트
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            A: 재무&정산, B: 사업&기획, C: 고객관련, D: 개발&연동, O: Beta오픈, S: 정보보안&법무
          </p>
        </div>
        <div className="text-sm text-gray-600">
          총 {flattenedTasks.length}개 항목 (펼쳐진 항목)
          {dateUnit === 'week' && ' | 📆 주별 보기 (하단 스크롤로 이동)'}
          {dateUnit === 'month' && ' | 🗓️ 월별 보기'}
        </div>
      </div>
      
      {/* 구조적 분리: Action Item 영역과 Gantt Chart 영역을 완전히 분리 */}
      <div className={styles.ganttFlexContainer}>
        {/* Action Item 영역 - 고정 크기 */}
        <ActionItemList 
          displayTasks={synchronizedTasks}
          treeState={treeState}
          onTaskSelect={onTaskSelect}
          onTaskDoubleClick={popup.openPopupFromEvent}
          onTreeToggle={handleTreeToggle}
          scrollRef={scroll.actionItemScrollRef}
          onScroll={scroll.handleActionItemScroll}
        />
        
        {/* Gantt Chart 영역 - 동적 크기 */}
        <div className={styles.ganttChartArea}>
          {/* Gantt Chart 헤더 - 날짜 표시 */}
          <GanttHeader 
            displayTasks={synchronizedTasks}
            dateUnit={dateUnit}
            expandedNodesSize={treeState.expandedNodes.size}
            scrollRef={scroll.headerScrollRef}
            renderTrigger={renderTrigger}
          />
          
          {/* Gantt Chart 내용 */}
          <GanttCanvas 
            canvasRef={canvasRef}
            containerRef={containerRef}
            isLoading={isLoading}
            onCanvasClick={handleCanvasClick}
            onCanvasDoubleClick={handleCanvasDoubleClick}
            scrollRef={scroll.ganttChartScrollRef}
            onScroll={scroll.handleGanttChartScroll}
          />
        </div>
      </div>

      {/* 세부업무 상세 팝업 */}
      {popup.isOpen && (
        <TaskDetailPopup 
          task={popup.selectedTaskDetail!}
          position={popup.popupPosition!}
          onClose={popup.closePopup}
          onTaskUpdate={(updatedTask: Task) => {
            if (onTaskUpdate) {
              onTaskUpdate(updatedTask)
            }
            popup.closePopup()
          }}
        />
      )}
    </div>
  )
}

export default CustomGanttChart

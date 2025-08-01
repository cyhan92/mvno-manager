'use client'
import React, { useRef } from 'react'
import { Task, ViewMode, DateUnit } from '../../types/task'
import { useCustomGanttChart } from '../../hooks/useCustomGanttChart'
import { useTreeState } from '../../hooks'
import { buildTaskTree, flattenTree, getTreeIcon, TreeNode } from '../../utils/tree'
import styles from '../../styles/components.module.css'

interface CustomGanttChartProps {
  tasks: Task[]
  viewMode: ViewMode
  dateUnit: DateUnit
  chartData: any[]
  groupedTasks: Record<string, Task[]>
  onTaskSelect: (selection: any) => void
  groupBy?: string
}

const CustomGanttChart: React.FC<CustomGanttChartProps> = ({
  tasks,
  viewMode,
  dateUnit,
  chartData,
  groupedTasks,
  onTaskSelect,
  groupBy
}) => {
  const actionItemScrollRef = useRef<HTMLDivElement>(null)
  const ganttChartScrollRef = useRef<HTMLDivElement>(null)
  const headerScrollRef = useRef<HTMLDivElement>(null)

  // 트리 상태 관리
  const treeState = useTreeState()

  // 트리 구조 생성
  const taskTree = React.useMemo(() => buildTaskTree(tasks), [tasks])
  
  // 펼쳐진 노드만 평면화
  const flattenedTasks = React.useMemo(() => 
    flattenTree(taskTree, treeState.expandedNodes), 
    [taskTree, treeState.expandedNodes]
  )

  const {
    canvasRef,
    containerRef,
    isLoading,
    displayTasks,
    handleCanvasClick,
    renderChart
  } = useCustomGanttChart({
    tasks: flattenedTasks, // 평면화된 트리 구조 전달
    viewMode,
    dateUnit,
    groupedTasks,
    onTaskSelect,
    groupBy
  })

  // 트리 상태가 변경될 때마다 캔버스 다시 그리기
  React.useEffect(() => {
    // 직접 캔버스를 다시 그리기
    if (canvasRef.current && flattenedTasks.length > 0) {
      // 약간의 딜레이를 두어 DOM 업데이트 후 렌더링
      const timer = setTimeout(() => {
        if (renderChart) {
          renderChart()
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [flattenedTasks, treeState.expandedNodes, renderChart, canvasRef])

  // 트리 노드 토글 핸들러
  const handleTreeToggle = (nodeId: string) => {
    // 현재 스크롤 위치 저장
    const currentScrollTop = actionItemScrollRef.current?.scrollTop || 0
    
    // 트리 상태 토글
    treeState.toggleNode(nodeId)
    
    // 다음 렌더링 사이클에서 스크롤 위치 복원
    setTimeout(() => {
      if (actionItemScrollRef.current) {
        actionItemScrollRef.current.scrollTop = currentScrollTop
      }
      if (ganttChartScrollRef.current) {
        ganttChartScrollRef.current.scrollTop = currentScrollTop
      }
    }, 100)
  }

  // Action Item 스크롤과 Gantt Chart 스크롤 동기화
  const handleActionItemScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    if (ganttChartScrollRef.current) {
      ganttChartScrollRef.current.scrollTop = scrollTop
    }
  }

  const handleGanttChartScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const scrollLeft = e.currentTarget.scrollLeft
    
    // 세로 스크롤 동기화 (Action Item과)
    if (actionItemScrollRef.current) {
      actionItemScrollRef.current.scrollTop = scrollTop
    }
    
    // 가로 스크롤 동기화 (헤더와)
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollLeft = scrollLeft
    }
  }

  if (!flattenedTasks || flattenedTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border">
        <p className="text-gray-500">표시할 작업이 없습니다. '+' 버튼을 클릭하여 항목을 펼쳐보세요.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className={`flex justify-between items-center mb-4 ${styles.ganttHeader}`}>
        <h3 className="text-lg font-semibold text-gray-900">
          📊 프로젝트 간트 차트 (Custom Canvas)
        </h3>
        <div className="text-sm text-gray-600">
          총 {flattenedTasks.length}개 항목 (펼쳐진 항목)
          {dateUnit === 'week' && ' | 📆 주별 보기 (하단 스크롤로 이동)'}
          {dateUnit === 'month' && ' | 🗓️ 월별 보기'}
        </div>
      </div>
      
      {/* 구조적 분리: Action Item 영역과 Gantt Chart 영역을 완전히 분리 */}
      <div className={styles.ganttFlexContainer}>
        {/* Action Item 영역 - 고정 크기 */}
        <div className={`${styles.actionItemArea} flex-shrink-0`}>
          <div className={styles.actionItemHeader}>
            <h4 className="font-semibold text-gray-700">📋 Action Items</h4>
          </div>
          <div 
            ref={actionItemScrollRef}
            className={styles.actionItemList}
            onScroll={handleActionItemScroll}
          >
            {flattenedTasks.map((node, index) => (
              <div 
                key={node.id}
                className={`${styles.actionItemRow} ${
                  index % 2 === 0 ? styles.actionItemRowEven : styles.actionItemRowOdd
                } ${node.isGroup ? styles.actionItemRowGroup : ''} ${
                  styles[`treeLevel${node.level}`]
                }`}
                onClick={() => onTaskSelect && onTaskSelect(node)}
              >
                <div className={styles.treeNode}>
                  {/* 토글 버튼 또는 빈 공간 */}
                  {node.hasChildren ? (
                    <div 
                      className={styles.treeToggle}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTreeToggle(node.id)
                      }}
                    >
                      {treeState.isExpanded(node.id) ? '−' : '+'}
                    </div>
                  ) : (
                    <div className={styles.treeToggleEmpty} />
                  )}
                  
                  {/* 아이콘 */}
                  <span className={styles.treeIcon}>
                    {getTreeIcon(node as TreeNode, treeState.isExpanded(node.id))}
                  </span>
                  
                  {/* 텍스트 */}
                  <span className={styles.treeText}>
                    {node.name || node.detail || `작업 ${index + 1}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gantt Chart 영역 - 동적 크기 */}
        <div className={styles.ganttChartArea}>
          {/* Gantt Chart 헤더 - 날짜 표시 */}
          <div 
            ref={headerScrollRef}
            className={`${styles.ganttChartHeader} flex-shrink-0`}
          >
            <canvas 
              key={`header-${flattenedTasks.length}-${treeState.expandedNodes.size}`} // 트리 상태 변경시 키 변경으로 재렌더링 강제
              ref={(canvas) => {
                if (canvas && flattenedTasks.length > 0) {
                  const ctx = canvas.getContext('2d')
                  if (ctx) {
                    // 헤더 캔버스 크기 설정
                    const container = canvas.parentElement
                    if (container) {
                      const containerWidth = container.clientWidth
                      let canvasWidth = containerWidth
                      
                      // 주별 표시 시 헤더 캔버스도 확대하되 컨테이너 내부에서 스크롤
                      if (dateUnit === 'week') {
                        canvasWidth = Math.max(containerWidth * 4, 1200)
                        
                        // 헤더 컨테이너에 스크롤 활성화
                        container.style.overflowX = 'auto'
                        container.style.overflowY = 'hidden'
                      } else {
                        // 월별 표시 시 헤더 스크롤 비활성화
                        container.style.overflowX = 'hidden'
                        container.style.overflowY = 'hidden'
                      }
                      
                      canvas.width = canvasWidth
                      canvas.height = 80
                      canvas.style.width = `${canvasWidth}px`
                      canvas.style.height = '80px'
                      
                      // 날짜 헤더 그리기
                      const validTasks = flattenedTasks.filter(t => t && t.start && t.end)
                      if (validTasks.length > 0) {
                        const startDate = new Date(Math.min(...validTasks.map(t => t.start.getTime())))
                        const endDate = new Date(Math.max(...validTasks.map(t => t.end.getTime())))
                        const timeRange = endDate.getTime() - startDate.getTime()
                        
                        let chartWidth = canvasWidth - 50
                        
                        // 배경
                        ctx.fillStyle = '#f9fafb'
                        ctx.fillRect(0, 0, canvas.width, canvas.height)
                        
                        // 날짜 헤더 그리기
                        if (dateUnit === 'month') {
                          const months = []
                          const currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
                          
                          while (currentMonth <= endDate) {
                            const monthStart = currentMonth.getTime()
                            const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                            const monthEnd = Math.min(nextMonth.getTime(), endDate.getTime())
                            
                            months.push({
                              start: monthStart,
                              end: monthEnd,
                              label: `${currentMonth.getFullYear()}.${String(currentMonth.getMonth() + 1).padStart(2, '0')}`
                            })
                            
                            currentMonth.setMonth(currentMonth.getMonth() + 1)
                          }
                          
                          ctx.font = 'bold 14px Arial'
                          ctx.textAlign = 'center'
                          ctx.textBaseline = 'middle'
                          ctx.fillStyle = '#1f2937'
                          
                          months.forEach(month => {
                            const x = ((month.start - startDate.getTime()) / timeRange) * chartWidth
                            const width = ((month.end - month.start) / timeRange) * chartWidth
                            ctx.fillText(month.label, x + width / 2, 40)
                            
                            // 구분선
                            ctx.strokeStyle = '#d1d5db'
                            ctx.lineWidth = 1
                            ctx.beginPath()
                            ctx.moveTo(x, 0)
                            ctx.lineTo(x, 80)
                            ctx.stroke()
                          })
                        } else {
                          // 주별 헤더
                          const weeks = []
                          const currentWeek = new Date(startDate)
                          const dayOfWeek = currentWeek.getDay()
                          const diff = currentWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
                          currentWeek.setDate(diff)
                          
                          while (currentWeek <= endDate) {
                            const weekStart = currentWeek.getTime()
                            const weekEnd = Math.min(weekStart + 7 * 24 * 60 * 60 * 1000, endDate.getTime())
                            const weekEndDate = new Date(weekEnd)
                            
                            weeks.push({
                              start: weekStart,
                              end: weekEnd,
                              label: `${currentWeek.getMonth() + 1}/${currentWeek.getDate()}-${weekEndDate.getMonth() + 1}/${weekEndDate.getDate()}`
                            })
                            
                            currentWeek.setDate(currentWeek.getDate() + 7)
                          }
                          
                          ctx.font = 'bold 12px Arial'
                          ctx.textAlign = 'center'
                          ctx.textBaseline = 'middle'
                          ctx.fillStyle = '#1f2937'
                          
                          weeks.forEach((week, index) => {
                            const x = ((week.start - startDate.getTime()) / timeRange) * chartWidth
                            const width = ((week.end - week.start) / timeRange) * chartWidth
                            ctx.fillText(week.label, x + width / 2, 40)
                            
                            // 구분선
                            ctx.strokeStyle = index % 2 === 0 ? '#d1d5db' : '#9ca3af'
                            ctx.lineWidth = index % 2 === 0 ? 2 : 1
                            ctx.beginPath()
                            ctx.moveTo(x, 0)
                            ctx.lineTo(x, 80)
                            ctx.stroke()
                          })
                        }
                      }
                    }
                  }
                }
              }}
              className="w-full h-20"
            />
          </div>
          
          {/* Gantt Chart 내용 - 스크롤 가능 */}
          <div 
            ref={ganttChartScrollRef}
            className={`${styles.ganttChartContainer} ${styles.customGanttContainer} ${
              dateUnit === 'week' ? styles.ganttChartContainerWeekly : ''
            }`}
            onScroll={handleGanttChartScroll}
          >
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">차트 로딩 중...</span>
              </div>
            )}
            
            <div 
              ref={containerRef} 
              className={`${
                dateUnit === 'week' ? styles.ganttCanvasContainerWeek : styles.ganttCanvasContainer
              }`}
            >
              <canvas 
                key={`gantt-${flattenedTasks.length}-${treeState.expandedNodes.size}`} // 트리 상태 변경시 키 변경으로 재렌더링 강제
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`${isLoading ? 'hidden' : 'block'} cursor-pointer ${styles.ganttCanvas}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomGanttChart

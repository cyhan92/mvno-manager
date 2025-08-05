import React from 'react'
import { DateUnit } from '../../types/task'
import { styles } from '../../styles'

interface GanttHeaderProps {
  displayTasks: any[]
  dateUnit: DateUnit
  expandedNodesSize: number
  scrollRef: React.RefObject<HTMLDivElement | null>
}

const GanttHeader: React.FC<GanttHeaderProps> = ({
  displayTasks,
  dateUnit,
  expandedNodesSize,
  scrollRef
}) => {
  return (
    <div 
      ref={scrollRef}
      className={`${styles.ganttChartHeader} flex-shrink-0`}
    >
      <canvas 
        key={`header-${displayTasks.length}-${expandedNodesSize}`} // 트리 상태 변경시 키 변경으로 재렌더링 강제
        ref={(canvas) => {
          if (canvas && displayTasks.length > 0) {
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
                const validTasks = displayTasks.filter(t => t && t.start && t.end)
                if (validTasks.length > 0) {
                  const startDate = new Date(Math.min(...validTasks.map(t => t.start.getTime())))
                  const endDate = new Date(Math.max(...validTasks.map(t => t.end.getTime())))
                  const timeRange = endDate.getTime() - startDate.getTime()
                  
                  // 간트 바와 동일한 chartWidth 계산 방식 사용
                  const leftMargin = 0  // leftMargin을 0으로 변경
                  let chartWidth = containerWidth
                  
                  // 주별 표시시 확대 (간트 바와 동일한 로직)
                  if (dateUnit === 'week') {
                    chartWidth = Math.max(chartWidth * 4, 1200)
                  }
                  
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
                    
                    months.forEach((month, index) => {
                      const x = leftMargin + ((month.start - startDate.getTime()) / timeRange) * chartWidth
                      const width = ((month.end - month.start) / timeRange) * chartWidth
                      ctx.fillText(month.label, x + width / 2, 40)
                      
                      // 구분선
                      ctx.strokeStyle = index % 2 === 0 ? '#d1d5db' : '#9ca3af'
                      ctx.lineWidth = index % 2 === 0 ? 2 : 1
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
                    
                    // 해당 주의 월요일로 이동
                    currentWeek.setDate(currentWeek.getDate() - dayOfWeek + 1)
                    
                    while (currentWeek <= endDate) {
                      const weekStart = currentWeek.getTime()
                      const weekEnd = new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000).getTime()
                      
                      weeks.push({
                        start: weekStart,
                        end: weekEnd,
                        label: `${String(currentWeek.getMonth() + 1).padStart(2, '0')}.${String(currentWeek.getDate()).padStart(2, '0')}`
                      })
                      
                      currentWeek.setDate(currentWeek.getDate() + 7)
                    }
                    
                    ctx.font = 'bold 12px Arial'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillStyle = '#1f2937'
                    
                    weeks.forEach((week, index) => {
                      const x = leftMargin + ((week.start - startDate.getTime()) / timeRange) * chartWidth
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
                  
                  // 오늘 날짜 표시
                  if (dateUnit === 'week') {
                    const today = new Date()
                    const todayX = leftMargin + ((today.getTime() - startDate.getTime()) / timeRange) * chartWidth
                    
                    if (todayX >= leftMargin && todayX <= leftMargin + chartWidth) {
                      ctx.strokeStyle = '#ef4444'
                      ctx.lineWidth = 2
                      ctx.beginPath()
                      ctx.moveTo(todayX, 0)
                      ctx.lineTo(todayX, 80)
                      ctx.stroke()
                      
                      ctx.fillStyle = '#ef4444'
                      ctx.font = '10px Arial'
                      ctx.fillText('오늘', todayX + 3, 15)
                    }
                  }
                }
              }
            }
          }
        }}
      />
    </div>
  )
}

export default GanttHeader

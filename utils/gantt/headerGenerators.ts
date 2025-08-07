// 월별 헤더 생성 함수
export const generateMonthHeaders = (startDate: Date, endDate: Date) => {
  const months = []
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  
  while (current <= endDate) {
    const monthStart = new Date(current)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    
    const monthLabel = current.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'short' 
    })
    
    months.push({
      label: monthLabel,
      start: monthStart.getTime(),
      end: monthEnd.getTime()
    })
    
    current.setMonth(current.getMonth() + 1)
  }
  
  return months
}

// 주별 헤더 생성 함수 (개선된 구현)
export const generateWeekHeaders = (startDate: Date, endDate: Date) => {
  const weeks = []
  const current = new Date(startDate)
  
  // 시작 날짜를 주의 시작일(월요일)로 조정
  const dayOfWeek = current.getDay()
  const adjustedStart = new Date(current)
  adjustedStart.setDate(current.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  
  let weekStart = new Date(adjustedStart)
  let weekNumber = 1
  
  while (weekStart < endDate) {
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6) // 일주일 끝
    
    // 더 명확한 주별 라벨 생성
    const startMonth = weekStart.getMonth() + 1
    const startDay = weekStart.getDate()
    const endMonth = weekEnd.getMonth() + 1
    const endDay = weekEnd.getDate()
    
    let weekLabel: string
    if (startMonth === endMonth) {
      weekLabel = `${startMonth}월 ${startDay}~${endDay}일`
    } else {
      weekLabel = `${startMonth}/${startDay}~${endMonth}/${endDay}`
    }
    
    weeks.push({
      label: weekLabel,
      start: weekStart.getTime(),
      end: weekEnd.getTime(),
      weekNumber
    })
    
    weekStart = new Date(weekEnd)
    weekStart.setDate(weekEnd.getDate() + 1) // 다음 주 시작
    weekNumber++
  }
  
  return weeks
}

// 일별 헤더 생성 함수
export const generateDayHeaders = (startDate: Date, endDate: Date) => {
  const days = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const dayLabel = current.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    })
    
    days.push({
      label: dayLabel,
      start: current.getTime(),
      end: new Date(current.getTime() + 24 * 60 * 60 * 1000 - 1).getTime()
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return days
}

interface HeaderItem {
  label: string
  start: number
  end: number
  weekNumber?: number
}

// 월별 헤더 생성 함수
export const generateMonthHeaders = (startDate: Date, endDate: Date): HeaderItem[] => {
  const months: HeaderItem[] = []
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

// 주별 헤더 생성 함수
export const generateWeekHeaders = (startDate: Date, endDate: Date): HeaderItem[] => {
  const weeks: HeaderItem[] = []
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
    
    let weekLabel = ''
    if (startMonth === endMonth) {
      // 같은 달 내의 주
      weekLabel = `${startMonth}/${startDay}-${endDay}`
    } else {
      // 월을 넘나드는 주
      weekLabel = `${startMonth}/${startDay}~${endMonth}/${endDay}`
    }
    
    weeks.push({
      label: weekLabel,
      start: weekStart.getTime(),
      end: weekEnd.getTime(),
      weekNumber: weekNumber
    })
    
    // 다음 주로 이동
    weekStart = new Date(weekStart)
    weekStart.setDate(weekStart.getDate() + 7)
    weekNumber++
  }
  
  return weeks
}

// 헤더 타입에 따른 헤더 생성
export const generateHeaders = (
  dateUnit: 'month' | 'week',
  startDate: Date,
  endDate: Date
): HeaderItem[] => {
  if (dateUnit === 'month') {
    return generateMonthHeaders(startDate, endDate)
  } else {
    return generateWeekHeaders(startDate, endDate)
  }
}

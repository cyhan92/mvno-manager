// Gantt 관련 포맷팅 및 유틸리티 함수들

export const getStatusBadgeClass = (status?: string): string => {
  switch (status) {
    case '완료':
      return 'bg-green-100 text-green-800'
    case '진행중':
      return 'bg-blue-100 text-blue-800'
    case '지연':
      return 'bg-red-100 text-red-800'
    case '대기':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '-'
  
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const formatDuration = (startDate: Date | string | null | undefined, endDate: Date | string | null | undefined): string => {
  if (!startDate || !endDate) return '-'
  
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-'
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return `${diffDays}일`
}

export const formatProgress = (progress: number | null | undefined): string => {
  if (progress === null || progress === undefined) return '0%'
  return `${Math.round(progress)}%`
}

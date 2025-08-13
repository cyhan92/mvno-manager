export const getStatusBadgeClass = (status?: string): string => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case '완료':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
    case 'in progress':
    case '진행중':
      return 'bg-blue-100 text-blue-800'
    case 'pending':
    case '대기':
      return 'bg-yellow-100 text-yellow-800'
    case 'blocked':
    case '차단됨':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const formatDate = (date: Date | string): string => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('ko-KR')
}

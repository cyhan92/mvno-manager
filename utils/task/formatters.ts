/**
 * 퍼센트 포맷터
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * 날짜 포맷터
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR')
}

/**
 * 기간 계산 (일 단위)
 */
export const calculateDuration = (start: Date, end: Date): number => {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

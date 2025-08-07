import { useMemo } from 'react'
import { DateUnit } from '../../types/task'

interface UseHeaderChartWidthProps {
  dateUnit: DateUnit
  chartWidth?: number
}

export const useHeaderChartWidth = ({ dateUnit, chartWidth }: UseHeaderChartWidthProps) => {
  const finalChartWidth = useMemo(() => {
    // 메인 차트에서 전달받은 chartWidth가 있으면 우선 사용
    if (chartWidth && chartWidth > 0) {
      return chartWidth
    }

    // fallback: 자체 계산 - 고정 너비 사용 (메인 차트와 동일한 로직)
    if (dateUnit === 'month') {
      // 월별 모드: 고정된 최소 너비 사용 (1000px)
      return 1000
    } else {
      // 주별 모드: 기본 너비를 확장할 예정이므로 1200px 사용
      return 1200
    }
  }, [dateUnit, chartWidth])

  return finalChartWidth
}

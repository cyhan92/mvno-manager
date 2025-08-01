import { useState } from 'react'
import { ViewMode, GroupBy } from '../../types/task'

export const useViewState = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')  // 항상 overview 고정
  const [groupBy, setGroupBy] = useState<GroupBy>('resource')     // 기본값: 담당자별

  return {
    viewMode,
    groupBy,
    setViewMode,
    setGroupBy
  }
}

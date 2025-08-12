// Deprecated: use hooks/gantt/useScrollSync instead. Keeping wrapper for compatibility.
import { useScrollSync } from './gantt/useScrollSync'

export const useGanttScroll = () => {
  const {
    actionItemScrollRef,
    ganttChartScrollRef,
    headerScrollRef,
    handleActionItemScroll,
    handleGanttChartScroll,
    handleHeaderScroll,
    setInitialScrollPosition
  } = useScrollSync({})

  return {
    actionItemScrollRef,
    ganttChartScrollRef,
    headerScrollRef,
    handleActionItemScroll,
    handleGanttChartScroll,
    handleHeaderScroll,
    setInitialScrollPosition
  }
}

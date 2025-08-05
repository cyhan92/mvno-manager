// Data hooks
export { useTasks } from './data/useTasks'
export { useTasksFromDatabase } from './data/useTasksFromDatabase'
export { useTaskAnalytics } from './data/useTaskAnalytics'

// State hooks
export { useViewState } from './state/useViewState'
export { useTreeState } from './state/useTreeState'

// Gantt hooks
export { useGanttPopup } from './useGanttPopup'
export { useGanttScroll } from './useGanttScroll'
export { useGanttHeight } from './useGanttHeight'

// Legacy re-exports (for backward compatibility)
export { useGanttChart } from './useGanttChart'
export { useCustomGanttChart } from './useCustomGanttChart'

// Data hooks
export { useTasks } from './data/useTasks'
export { useTasksFromDatabase } from './data/useTasksFromDatabase'
export { useTaskAnalytics } from './data/useTaskAnalytics'
export { useTaskManager } from './data/useTaskManager'

// State hooks
export { useViewState } from './state/useViewState'
export { useTreeState } from './useTreeState'

// Gantt hooks
export { useGanttPopup } from './useGanttPopup'
export { useGanttHeight } from './useGanttHeight'

// Popup related hooks
export { usePopupPosition } from './popup/usePopupPosition'
export { useDragHandler } from './popup/useDragHandler'
export { useTaskApi } from './popup/useTaskApi'

// Legacy re-exports (for backward compatibility)
export { useGanttChart } from './useGanttChart'
export { useCustomGanttChart } from './useCustomGanttChart'

// Form hooks
export { useActionItemForm } from './forms/useActionItemForm'

// Gantt-specific hooks
export { useGanttTreeState } from './gantt/useGanttTreeState'
export { useGanttRenderTrigger } from './gantt/useGanttRenderTrigger'
export { useGanttSyncRendering } from './gantt/useGanttSyncRendering'
export { useGanttTreeToggle } from './gantt/useGanttTreeToggle'

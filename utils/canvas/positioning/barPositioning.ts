/**
 * 간트 바 위치 계산 유틸리티
 */

import { Task } from '../../../types/task'
import { GanttBarStyle } from '../types'

/**
 * 간트 바 위치 계산
 */
export const calculateBarPosition = (
  task: Task,
  startDate: Date,
  endDate: Date,
  timeRange: number,
  chartWidth: number,
  y: number,
  rowHeight: number
): GanttBarStyle => {
  const taskStart = Math.max(task.start.getTime(), startDate.getTime())
  const taskEnd = Math.min(task.end.getTime(), endDate.getTime())
  
  const x = ((taskStart - startDate.getTime()) / timeRange) * chartWidth
  const width = ((taskEnd - taskStart) / timeRange) * chartWidth
  
  return {
    x: Math.max(0, x),
    y: y + 5,
    width: Math.max(1, width),
    height: rowHeight - 10,
    backgroundColor: '#e5e7eb',
    borderColor: '#d1d5db'
  }
}

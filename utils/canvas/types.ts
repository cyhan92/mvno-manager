import { Task } from '../../types/task'

export interface CanvasRenderContext {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  width: number
  height: number
}

export interface GanttBarStyle {
  x: number
  y: number
  width: number
  height: number
  backgroundColor: string
  borderColor: string
  progressColor?: string
  progressWidth?: number
}

export interface TextStyle {
  color: string
  font: string
  align: CanvasTextAlign
  baseline: CanvasTextBaseline
}

export interface RenderOptions {
  dateUnit: 'week' | 'month'
  leftMargin: number
  topMargin: number
  rowHeight: number
  chartWidth: number
  chartHeight: number
}

export interface ProgressBarConfig {
  showProgress: boolean
  showText: boolean
  minWidthForInternalText: number
  externalTextOffset: number
}

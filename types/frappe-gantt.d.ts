declare module 'frappe-gantt' {
  interface GanttOptions {
    header_height?: number
    column_width?: number
    step?: number
    view_modes?: string[]
    view_mode?: string
    date_format?: string
    bar_height?: number
    bar_corner_radius?: number
    arrow_curve?: number
    padding?: number
    view_mode_padding?: any
    language?: string
    on_click?: (task: any) => void
    on_date_change?: (task: any, start: Date, end: Date) => void
    on_progress_change?: (task: any, progress: number) => void
  }

  interface GanttTask {
    id: string
    name: string
    start: string
    end: string
    progress: number
    dependencies?: string
    custom_class?: string
  }

  class Gantt {
    constructor(element: HTMLElement, tasks: GanttTask[], options?: GanttOptions)
    change_view_mode(mode: string): void
    refresh(tasks: GanttTask[]): void
  }

  export = Gantt
}

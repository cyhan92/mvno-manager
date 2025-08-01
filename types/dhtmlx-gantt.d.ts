declare global {
  interface Window {
    gantt: any
  }
}

declare module 'dhtmlx-gantt' {
  interface GanttStatic {
    init(container: HTMLElement): void
    parse(data: any): void
    render(): void
    destructor(): void
    attachEvent(event: string, handler: Function): string
    i18n: {
      setLocale(locale: string): void
    }
    config: {
      scales: any[]
      date_scale: string
      scale_height: number
      columns: any[]
      grid_width: number
      row_height: number
      static_background: boolean
      drag_move: boolean
      drag_resize: boolean
      drag_progress: boolean
    }
  }

  export const gantt: GanttStatic
}

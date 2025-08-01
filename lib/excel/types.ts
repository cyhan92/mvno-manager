import { Task as BaseTask } from '../../types/task'

export interface ExcelTask extends BaseTask {
  // Excel 관련 추가 필드들
  department?: string
  cost?: string | number
  notes?: string
}

export interface ExcelParseOptions {
  headerRow: number
  dataStartRow: number
  sheetName?: string
}

export interface ExcelParseResult {
  tasks: ExcelTask[]
  totalRows: number
  filteredRows: number
  errors: string[]
}

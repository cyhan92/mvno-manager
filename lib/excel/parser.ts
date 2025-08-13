import * as XLSX from 'xlsx'
import { ExcelTask, ExcelParseOptions, ExcelParseResult } from './types'
import { EXCEL_CONFIG } from './config'
import {
  convertExcelDate,
  normalizePercentComplete,
  adjustProgressByStatus,
  extractResource,
  extractDepartment,
  extractCategory,
  normalizeStatus
} from './utils'

/**
 * Excel 워크북을 읽어서 원시 데이터를 반환
 */
export const readExcelWorkbook = (fileBuffer: Buffer): XLSX.WorkBook => {
  return XLSX.read(fileBuffer, { type: 'buffer' })
}

/**
 * 워크시트를 2차원 배열로 변환
 */
export const worksheetToArray = (worksheet: XLSX.WorkSheet): any[][] => {
  return XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
}

/**
 * 원시 Excel 행 데이터를 Task 객체로 변환
 */
export const parseExcelRow = (row: any[], index: number): ExcelTask => {
  const { COLUMN_MAPPING } = EXCEL_CONFIG
  
  // 날짜 변환
  const startDate = convertExcelDate(row[COLUMN_MAPPING.START_DATE])
  const endDate = convertExcelDate(row[COLUMN_MAPPING.END_DATE])
  
  // 완료율 정규화
  let percentComplete = normalizePercentComplete(row[COLUMN_MAPPING.PERCENT_COMPLETE])
  
  // 상태에 따른 진행률 조정
  const status = normalizeStatus(row[COLUMN_MAPPING.STATUS])
  percentComplete = adjustProgressByStatus(status, percentComplete)
  
  return {
    id: `TASK-${String(index + 1).padStart(3, '0')}`,
    name: row[COLUMN_MAPPING.DETAIL] || 'Unnamed Task',
    resource: extractResource(row[COLUMN_MAPPING.MAIN_RESOURCE], row[COLUMN_MAPPING.SUB_RESOURCE]),
    start: startDate,
    end: endDate,
    duration: row[COLUMN_MAPPING.DURATION] || null,
    percentComplete: percentComplete,
    dependencies: null, // Excel에는 선행업무 정보가 없음
    category: extractCategory(row[COLUMN_MAPPING.MIDDLE_CATEGORY], row[COLUMN_MAPPING.MAJOR_CATEGORY]),
    subcategory: row[COLUMN_MAPPING.MINOR_CATEGORY],
    detail: row[COLUMN_MAPPING.DETAIL],
    department: extractDepartment(row[COLUMN_MAPPING.MAIN_DEPARTMENT], row[COLUMN_MAPPING.SUB_DEPARTMENT]),
  status: status,
    cost: row[COLUMN_MAPPING.COST],
    notes: row[COLUMN_MAPPING.NOTES],
    // 그룹핑을 위한 추가 필드
    majorCategory: extractCategory(row[COLUMN_MAPPING.MAJOR_CATEGORY]),
    middleCategory: extractCategory(row[COLUMN_MAPPING.MIDDLE_CATEGORY]),
    minorCategory: extractCategory(row[COLUMN_MAPPING.MINOR_CATEGORY])
  }
}

/**
 * Excel 데이터를 파싱하여 Task 배열로 변환
 */
export const parseExcelData = (
  rawData: any[][],
  options: ExcelParseOptions = EXCEL_CONFIG.DEFAULT_OPTIONS
): ExcelParseResult => {
  const errors: string[] = []
  
  try {
    if (!rawData || rawData.length < options.dataStartRow + 1) {
      errors.push('Excel 파일에 충분한 데이터가 없습니다.')
      return { tasks: [], totalRows: 0, filteredRows: 0, errors }
    }
    
    // 헤더 검증
    const headers = rawData[options.headerRow]
    if (!headers || headers.length === 0) {
      errors.push('Excel 헤더를 찾을 수 없습니다.')
      return { tasks: [], totalRows: 0, filteredRows: 0, errors }
    }
    
    // 데이터 행 추출
    const dataRows = rawData.slice(options.dataStartRow)
    
    // 세부업무가 있는 행만 필터링
    const filteredRows = dataRows.filter(row => 
      row && row.length > 0 && row[EXCEL_CONFIG.COLUMN_MAPPING.DETAIL]
    )
    
    // Task 객체로 변환
    const tasks = filteredRows.map((row, index) => {
      try {
        return parseExcelRow(row, index)
      } catch (error) {
        errors.push(`행 ${index + options.dataStartRow + 1} 파싱 오류: ${error}`)
        return null
      }
    }).filter((task): task is ExcelTask => task !== null)
    
    return {
      tasks,
      totalRows: rawData.length,
      filteredRows: filteredRows.length,
      errors
    }
    
  } catch (error) {
    errors.push(`Excel 파싱 중 오류 발생: ${error}`)
    return { tasks: [], totalRows: 0, filteredRows: 0, errors }
  }
}

import fs from 'fs'
import path from 'path'
import { ExcelTask, ExcelParseResult } from './types'
import { readExcelWorkbook, worksheetToArray, parseExcelData } from './parser'

/**
 * 가능한 Excel 파일 경로들을 반환
 */
export const getExcelFilePaths = (): string[] => {
  return [
    path.join(process.cwd(), 'todo_list_copy.xlsx'),
    path.join(process.cwd(), '250729_TODO LIST.xlsx'),
  ]
}

/**
 * 접근 가능한 Excel 파일을 찾아 반환
 */
export const findAccessibleExcelFile = (): string | null => {
  const possiblePaths = getExcelFilePaths()
  
  for (const filePath of possiblePaths) {
    try {
      if (fs.existsSync(filePath)) {
        fs.accessSync(filePath, fs.constants.R_OK)
        return filePath
      }
    } catch (error) {
      console.log(`Cannot access ${filePath}:`, (error as Error).message)
      continue
    }
  }
  
  return null
}

/**
 * Excel 파일을 읽어서 Task 배열로 변환
 */
export const loadTasksFromExcel = async (): Promise<ExcelParseResult> => {
  const filePath = findAccessibleExcelFile()
  
  if (!filePath) {
    return {
      tasks: [],
      totalRows: 0,
      filteredRows: 0,
      errors: ['접근 가능한 Excel 파일을 찾을 수 없습니다.']
    }
  }
  
  try {
    console.log('Reading Excel file:', filePath)
    
    // 파일을 버퍼로 읽기
    const fileBuffer = fs.readFileSync(filePath)
    
    // 워크북 로드
    const workbook = readExcelWorkbook(fileBuffer)
    console.log('Workbook loaded, sheet names:', workbook.SheetNames)
    
    // 첫 번째 시트 선택
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    
    // 2차원 배열로 변환
    const rawData = worksheetToArray(worksheet)
    console.log('Raw data loaded, total rows:', rawData.length)
    
    // 파싱 실행
    const result = parseExcelData(rawData)
    
    console.log(`Parsing completed: ${result.tasks.length} tasks from ${result.filteredRows} filtered rows`)
    
    if (result.errors.length > 0) {
      console.warn('Parsing errors:', result.errors)
    }
    
    return result
    
  } catch (error) {
    console.error('Error loading Excel file:', error)
    return {
      tasks: [],
      totalRows: 0,
      filteredRows: 0,
      errors: [`Excel 파일 로드 오류: ${error}`]
    }
  }
}

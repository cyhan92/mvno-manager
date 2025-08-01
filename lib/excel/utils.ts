import { EXCEL_CONFIG } from './config'

/**
 * Excel 날짜 시리얼 번호를 JavaScript Date로 변환
 */
export const convertExcelDate = (excelSerial: number): Date => {
  if (!excelSerial || typeof excelSerial !== 'number') {
    return new Date()
  }
  
  return new Date((excelSerial - EXCEL_CONFIG.EXCEL_DATE_OFFSET) * EXCEL_CONFIG.MS_PER_DAY)
}

/**
 * 완료율 값을 정규화 (소수점을 백분율로 변환)
 */
export const normalizePercentComplete = (value: number | undefined): number => {
  if (!value || typeof value !== 'number') {
    return 0
  }
  
  // 소수점 형태(0.1)를 백분율(10)로 변환
  if (value <= 1) {
    return value * 100
  }
  
  return value
}

/**
 * 상태에 따른 진행률 조정
 */
export const adjustProgressByStatus = (status: string, percentComplete: number): number => {
  switch (status) {
    case EXCEL_CONFIG.STATUS_VALUES.COMPLETED:
      return 100
    case EXCEL_CONFIG.STATUS_VALUES.NOT_STARTED:
      return percentComplete === 0 ? 0 : percentComplete
    case EXCEL_CONFIG.STATUS_VALUES.IN_PROGRESS:
      // 진행중인데 완료율이 0이면 최소 10%로 설정
      return percentComplete === 0 ? 10 : percentComplete
    default:
      return percentComplete
  }
}

/**
 * 담당자 정보 추출 (정담당자 우선, 없으면 부담당자)
 */
export const extractResource = (mainResource: string, subResource: string): string => {
  return mainResource || subResource || 'N/A'
}

/**
 * 부서 정보 추출 (주관부서 우선, 없으면 부관부서)
 */
export const extractDepartment = (mainDept: string, subDept: string): string => {
  return mainDept || subDept || '미지정'
}

/**
 * 카테고리 정보 추출 (기본값 처리)
 */
export const extractCategory = (category: string, defaultValue: string = '미분류'): string => {
  return category || defaultValue
}

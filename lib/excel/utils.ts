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
      // 진행중 상태여도 완료율을 그대로 유지 (기존 10% 자동 설정 제거)
      return percentComplete
    default:
      return percentComplete
  }
}

/**
 * 상태 문자열을 정규화합니다.
 * - 트림/대소문자/동의어/변형을 허용 목록으로 매핑
 */
export const normalizeStatus = (raw: unknown): string => {
  if (typeof raw !== 'string') return ''
  const s = raw.trim()
  // 정확 매칭 우선
  if (s === EXCEL_CONFIG.STATUS_VALUES.COMPLETED) return EXCEL_CONFIG.STATUS_VALUES.COMPLETED
  if (s === EXCEL_CONFIG.STATUS_VALUES.IN_PROGRESS) return EXCEL_CONFIG.STATUS_VALUES.IN_PROGRESS
  if (s === EXCEL_CONFIG.STATUS_VALUES.NOT_STARTED) return EXCEL_CONFIG.STATUS_VALUES.NOT_STARTED

  // 흔한 변형/동의어 매핑
  const lower = s.toLowerCase()
  if (lower === '완료됨' || lower === 'complete' || lower === 'completed' || lower === 'done') {
    return EXCEL_CONFIG.STATUS_VALUES.COMPLETED
  }
  if (lower === '진행' || lower === 'in progress' || lower === 'progress') {
    return EXCEL_CONFIG.STATUS_VALUES.IN_PROGRESS
  }
  if (lower === '미시작' || lower === 'not started' || lower === 'todo') {
    return EXCEL_CONFIG.STATUS_VALUES.NOT_STARTED
  }
  return s
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

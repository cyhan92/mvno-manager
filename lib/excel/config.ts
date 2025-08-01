import { ExcelParseOptions } from './types'

export const EXCEL_CONFIG = {
  DEFAULT_OPTIONS: {
    headerRow: 3,
    dataStartRow: 4,
    sheetName: undefined
  } as ExcelParseOptions,
  
  COLUMN_MAPPING: {
    MAJOR_CATEGORY: 0,      // 대분류
    MIDDLE_CATEGORY: 1,     // 중분류
    MINOR_CATEGORY: 2,      // 소분류
    MAIN_DEPARTMENT: 3,     // 주관부서(정)
    SUB_DEPARTMENT: 4,      // 주관부서(부)
    MAIN_RESOURCE: 5,       // 담당자(정)
    SUB_RESOURCE: 6,        // 담당자(부)
    DETAIL: 7,              // 세부업무
    STATUS: 8,              // 완료여부
    COST: 9,                // 추정 소요 비용
    NOTES: 10,              // 비고
    START_DATE: 11,         // 시작일
    END_DATE: 12,           // 종료일
    DURATION: 13,           // 기간
    PERCENT_COMPLETE: 14,   // 완료율
    CHART: 15               // 차트
  },
  
  STATUS_VALUES: {
    COMPLETED: '완료',
    IN_PROGRESS: '진행중',
    NOT_STARTED: '미완료'
  },
  
  // Excel 날짜 시리얼 번호를 Date로 변환하는 기준점
  EXCEL_DATE_OFFSET: 25569, // 1900년 1월 1일부터 1970년 1월 1일까지 일수
  MS_PER_DAY: 86400 * 1000
}

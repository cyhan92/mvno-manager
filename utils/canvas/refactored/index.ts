/**
 * 리팩토링된 캔버스 유틸리티 모듈
 * 기존 legacy.ts와 gantt.ts를 기능별로 분리한 통합 모듈
 */

// 헤더 관련
export { generateMonthHeaders, generateWeekHeaders } from '../headers/headerGenerators'
export type { HeaderItem } from '../headers/headerGenerators'

// 그리드 관련
export { drawGridLines } from '../grid/gridRenderer'

// UI 요소 관련
export { drawActionItemHeader, drawTaskRow, drawChartBorder } from '../ui/uiRenderer'

// 지시자 관련
export { drawTodayLine } from '../indicators/todayIndicator'

// 바 렌더링 관련
export { drawLegacyGanttBar } from '../bars/legacyBarRenderer'
export { drawGroupBar } from '../bars/groupBarRenderer'
export { drawTaskBar } from '../bars/taskBarRenderer'

// 위치 계산 관련
export { calculateBarPosition } from '../positioning/barPositioning'

// 도형 관련
export { drawRoundedRect } from '../shapes/roundedRect'

// 텍스트 렌더링 관련
export { 
  drawProgressText, 
  drawInternalProgressText, 
  drawExternalProgressText 
} from '../text/progressTextRenderer'

// 기존 호환성을 위한 레거시 내보내기
export { drawLegacyGanttBar as drawGanttBar } from '../bars/legacyBarRenderer'

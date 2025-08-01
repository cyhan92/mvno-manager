import { TextStyle, GanttBarStyle } from './types'

export const CANVAS_CONFIG = {
  COLORS: {
    BACKGROUND: '#ffffff',
    GRID_LINE: '#e5e7eb',
    BORDER: '#d1d5db',
    HEADER_BG: '#f9fafb',
    ROW_EVEN: '#ffffff',
    ROW_ODD: '#f9fafb',
    TEXT_PRIMARY: '#1f2937',
    TEXT_SECONDARY: '#6b7280',
    GROUP_BG: '#f3f4f6',
    GROUP_BAR: '#6b7280',
    TASK_BAR: '#3b82f6',
    TASK_BAR_BG: '#e5e7eb',
    
    // 진행률 색상
    PROGRESS: {
      COMPLETED: '#16a34a',      // 진한 초록색 (100%)
      HIGH: '#3b82f6',           // 파란색 (50% 이상)
      LOW: '#f59e0b',            // 주황색 (50% 미만)
      NONE: '#9ca3af'            // 회색 (0%)
    },
    
    // 그룹 색상
    GROUP: {
      MAJOR: {
        bg: 'rgba(59, 130, 246, 0.1)',
        border: '#3b82f6',
        progress: 'rgba(59, 130, 246, 0.3)'
      },
      MIDDLE: {
        bg: 'rgba(16, 185, 129, 0.1)',
        border: '#10b981',
        progress: 'rgba(16, 185, 129, 0.3)'
      },
      MINOR: {
        bg: 'rgba(245, 158, 11, 0.1)',
        border: '#f59e0b',
        progress: 'rgba(245, 158, 11, 0.3)'
      }
    }
  },
  
  FONTS: {
    HEADER: 'bold 14px Arial',
    PROGRESS: 'bold 12px Arial',
    SMALL: '11px Arial',
    MEDIUM: '12px Arial',
    BOLD: 'bold 12px Arial',
    REGULAR: '12px Arial'
  },
  
  DIMENSIONS: {
    ROW_HEIGHT: 40,
    TEXT_PADDING: 10,
    PROGRESS_TEXT_MIN_WIDTH: 60,
    EXTERNAL_TEXT_OFFSET: 5
  }
}

// 상태별 색상 매핑
export const getStatusColors = (status?: string) => {
  switch (status) {
    case '완료':
      return {
        bg: CANVAS_CONFIG.COLORS.PROGRESS.COMPLETED,
        border: CANVAS_CONFIG.COLORS.PROGRESS.COMPLETED
      }
    case '진행중':
      return {
        bg: CANVAS_CONFIG.COLORS.PROGRESS.HIGH,
        border: CANVAS_CONFIG.COLORS.PROGRESS.HIGH
      }
    case '미완료':
    default:
      return {
        bg: CANVAS_CONFIG.COLORS.ROW_EVEN,
        border: CANVAS_CONFIG.COLORS.BORDER
      }
  }
}

// 진행률에 따른 색상 반환
export const getProgressColor = (percentComplete: number): string => {
  if (percentComplete >= 100) return CANVAS_CONFIG.COLORS.PROGRESS.COMPLETED
  if (percentComplete >= 50) return CANVAS_CONFIG.COLORS.PROGRESS.HIGH
  if (percentComplete > 0) return CANVAS_CONFIG.COLORS.PROGRESS.LOW
  return CANVAS_CONFIG.COLORS.PROGRESS.NONE
}

// 그룹 레벨에 따른 스타일 반환
export const getGroupStyle = (level: number) => {
  switch (level) {
    case 0: return CANVAS_CONFIG.COLORS.GROUP.MAJOR
    case 1: return CANVAS_CONFIG.COLORS.GROUP.MIDDLE
    case 2: return CANVAS_CONFIG.COLORS.GROUP.MINOR
    default: return CANVAS_CONFIG.COLORS.GROUP.MINOR
  }
}

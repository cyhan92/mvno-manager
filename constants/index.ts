import { GroupBy, DateUnit } from '../types/task'

export const GROUP_BY_OPTIONS = [
  { key: 'resource' as GroupBy, label: '👥 담당자별', icon: '👥' },
  { key: 'action' as GroupBy, label: '📋 Action Item별', icon: '📋' },
]

export const DATE_UNIT_OPTIONS = [
  { key: 'week' as DateUnit, label: '📆 주별', icon: '📆' },
  { key: 'month' as DateUnit, label: '🗓️ 월별', icon: '🗓️' },
]

export const RISK_THRESHOLD = {
  PROGRESS_BELOW: 50,
  DAYS_UNTIL_DEADLINE: 7,
} as const

export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  GRAY: '#6b7280',
} as const

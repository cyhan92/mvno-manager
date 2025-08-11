export interface Task {
  id: string // task_id (TASK-001, TASK-002 등)
  dbId?: string // 실제 DB의 UUID
  name: string // UI 표시용 (Action Item에 보이는 내용)
  title?: string // DB 저장용 (실제 세부업무 내용, 현재는 name과 동일)
  resource: string
  start: Date
  end: Date
  duration: number | null
  percentComplete: number
  dependencies: string | null
  category?: string
  subcategory?: string
  detail?: string
  department?: string
  status?: string
  cost?: string | number
  notes?: string
  // 그룹핑을 위한 추가 필드
  majorCategory?: string
  middleCategory?: string
  minorCategory?: string
  // 그룹 여부 표시
  isGroup?: boolean
  // 트리 구조를 위한 추가 필드
  level?: number // 0: 대분류, 1: 소분류, 2: 세부업무 (중분류는 데이터에만 포함)
  parentId?: string // 부모 항목 ID
  hasChildren?: boolean // 자식 항목 여부
}

export type ViewMode = 'overview' | 'detailed'
export type GroupBy = 'resource' | 'action' | 'major' | 'middle' | 'minor'
export type DateUnit = 'week' | 'month'

// 트리 노드 상태 관리
export interface TreeNodeState {
  id: string
  isExpanded: boolean
  level: number
  hasChildren: boolean
}

// 트리 상태 관리 인터페이스
export interface TreeState {
  expandedNodes: Set<string>
  toggleNode: (nodeId: string) => void
  isExpanded: (nodeId: string) => boolean
  expandAll: () => void
  collapseAll: () => void
  expandToLevel: (level: number) => void
  setTreeData?: (data: any[]) => void
}

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  notStarted: number
  averageProgress: number
}

export interface ResourceStats {
  total: number
  completed: number
  progress: number
}

export interface RiskAnalysis {
  riskTasks: Task[]
  delayedTasks: Task[]
}

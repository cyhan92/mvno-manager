import { Task } from '../../types/task'

export interface TreeNode extends Task {
  level: number
  parentId?: string
  hasChildren: boolean
  children?: TreeNode[]
}

export interface TreeBuildOptions {
  calculateProgress: boolean
  sortOrder: 'asc' | 'desc'
}

export interface TreeFlattenOptions {
  includeCollapsed: boolean
  maxDepth?: number
}

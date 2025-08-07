import { Task } from '../../types/task'
import { TreeNode } from './types'
import { calculateAverageProgress } from './progress'

// 대분류 정렬 순서 정의 (B -> A -> S -> D -> C -> O)
const getMajorCategoryOrder = (category: string): number => {
  const firstChar = category.charAt(0).toUpperCase()
  const orderMap: Record<string, number> = {
    'B': 1,
    'A': 2,
    'S': 3,
    'D': 4,
    'C': 5,
    'O': 6
  }
  return orderMap[firstChar] || 999 // 정의되지 않은 것은 맨 뒤로
}

// 작업 데이터를 트리 구조로 변환 (대분류 > 소분류 > 세부업무)
export const buildTaskTree = (tasks: Task[]): TreeNode[] => {
  const tree: TreeNode[] = []
  const nodeMap = new Map<string, TreeNode>()

  // 대분류별 그룹핑
  const majorGroups = new Map<string, Task[]>()
  
  tasks.forEach(task => {
    const major = task.majorCategory || '미분류'
    if (!majorGroups.has(major)) {
      majorGroups.set(major, [])
    }
    majorGroups.get(major)!.push(task)
  })

  // 트리 구조 생성 (대분류 > 소분류 > 세부업무)
  // 대분류를 B, A, S, D, C, O 순서로 정렬한 후, 2차로 알파벳 순 정렬
  const sortedMajorCategories = Array.from(majorGroups.keys()).sort((a, b) => {
    const orderA = getMajorCategoryOrder(a)
    const orderB = getMajorCategoryOrder(b)
    
    // 1차 정렬: 기존 정의된 순서 (B->A->S->D->C->O)
    if (orderA !== orderB) {
      return orderA - orderB
    }
    
    // 2차 정렬: 같은 순서 그룹 내에서 알파벳 순 (ascending)
    return a.localeCompare(b)
  })

  sortedMajorCategories.forEach((majorCategory) => {
    const majorTasks = majorGroups.get(majorCategory)!
    const majorId = `major_${majorCategory}`
    
    // 대분류 노드 생성
    const majorNode: TreeNode = {
      id: majorId,
      name: majorCategory,
      resource: '',
      start: new Date(Math.min(...majorTasks.map(t => t.start.getTime()))),
      end: new Date(Math.max(...majorTasks.map(t => t.end.getTime()))),
      duration: null,
      percentComplete: 0, // 하위 항목들 추가 후 계산
      dependencies: null,
      majorCategory,
      isGroup: true,
      level: 0,
      hasChildren: true,
      children: []
    }

    // 소분류별 그룹핑 (중분류는 건너뛰고 바로 소분류로)
    const minorGroups = new Map<string, Task[]>()
    majorTasks.forEach(task => {
      const minor = task.minorCategory || '미분류'
      // 중복을 피하기 위해 minorCategory만 사용
      if (!minorGroups.has(minor)) {
        minorGroups.set(minor, [])
      }
      minorGroups.get(minor)!.push(task)
    })

    // 소분류 노드들 생성
    minorGroups.forEach((minorTasks, minorCategory) => {
      const minorId = `minor_${majorCategory}_${minorCategory}`

      // 중분류 정보를 가져와서 "[중분류] 소분류" 형태로 표시
      const middleCategory = minorTasks[0]?.middleCategory || ''
      const displayName = middleCategory ? `[${middleCategory}] ${minorCategory}` : minorCategory

      const minorNode: TreeNode = {
        id: minorId,
        name: displayName,
        resource: '',
        start: new Date(Math.min(...minorTasks.map(t => t.start.getTime()))),
        end: new Date(Math.max(...minorTasks.map(t => t.end.getTime()))),
        duration: null,
        percentComplete: 0, // 하위 항목들 추가 후 계산
        dependencies: null,
        majorCategory,
        minorCategory,
        // 중분류 정보는 데이터에만 포함 (트리 구조에는 표시하지 않음)
        middleCategory: minorTasks[0]?.middleCategory,
        isGroup: true,
        level: 1, // 레벨 조정: 소분류가 레벨 1
        parentId: majorId,
        hasChildren: true,
        children: []
      }

      // 실제 작업들 추가 (세부업무)
      minorTasks.forEach((task) => {
        const taskNode: TreeNode = {
          ...task,
          level: 2, // 레벨 조정: 세부업무가 레벨 2
          parentId: minorId,
          hasChildren: false,
          children: []
        }
        minorNode.children!.push(taskNode)
        nodeMap.set(task.id, taskNode)
      })

      // 소분류 진행율 계산: 하위 작업들의 평균 진행율
      minorNode.percentComplete = calculateAverageProgress(minorTasks)

      majorNode.children!.push(minorNode)
      nodeMap.set(minorId, minorNode)
    })

    // 대분류 진행율 계산: 하위 소분류들의 평균 진행율
    majorNode.percentComplete = calculateAverageProgress(majorNode.children!)

    tree.push(majorNode)
    nodeMap.set(majorId, majorNode)
  })

  return tree
}

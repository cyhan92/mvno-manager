import { Task } from '../../types/task'
import { TreeNode } from './types'
import { calculateAverageProgress } from './progress'

// 작업 데이터를 트리 구조로 변환
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

  // 트리 구조 생성
  majorGroups.forEach((majorTasks, majorCategory) => {
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

    // 중분류별 그룹핑
    const middleGroups = new Map<string, Task[]>()
    majorTasks.forEach(task => {
      const middle = task.middleCategory || '미분류'
      const middleKey = `${majorCategory}_${middle}`
      if (!middleGroups.has(middleKey)) {
        middleGroups.set(middleKey, [])
      }
      middleGroups.get(middleKey)!.push(task)
    })

    // 중분류 노드들 생성
    middleGroups.forEach((middleTasks, middleKey) => {
      const middleCategory = middleKey.split('_').slice(1).join('_')
      const middleId = `middle_${middleKey}`

      const middleNode: TreeNode = {
        id: middleId,
        name: middleCategory,
        resource: '',
        start: new Date(Math.min(...middleTasks.map(t => t.start.getTime()))),
        end: new Date(Math.max(...middleTasks.map(t => t.end.getTime()))),
        duration: null,
        percentComplete: 0, // 하위 항목들 추가 후 계산
        dependencies: null,
        majorCategory,
        middleCategory,
        isGroup: true,
        level: 1,
        parentId: majorId,
        hasChildren: true,
        children: []
      }

      // 소분류별 그룹핑
      const minorGroups = new Map<string, Task[]>()
      middleTasks.forEach(task => {
        const minor = task.minorCategory || '미분류'
        const minorKey = `${middleKey}_${minor}`
        if (!minorGroups.has(minorKey)) {
          minorGroups.set(minorKey, [])
        }
        minorGroups.get(minorKey)!.push(task)
      })

      // 소분류 노드들 생성
      minorGroups.forEach((minorTasks, minorKey) => {
        const minorCategory = minorKey.split('_').slice(2).join('_')
        const minorId = `minor_${minorKey}`

        const minorNode: TreeNode = {
          id: minorId,
          name: minorCategory,
          resource: '',
          start: new Date(Math.min(...minorTasks.map(t => t.start.getTime()))),
          end: new Date(Math.max(...minorTasks.map(t => t.end.getTime()))),
          duration: null,
          percentComplete: 0, // 하위 항목들 추가 후 계산
          dependencies: null,
          majorCategory,
          middleCategory,
          minorCategory,
          isGroup: true,
          level: 2,
          parentId: middleId,
          hasChildren: true,
          children: []
        }

        // 실제 작업들 추가
        minorTasks.forEach((task) => {
          const taskNode: TreeNode = {
            ...task,
            level: 3,
            parentId: minorId,
            hasChildren: false,
            children: []
          }
          minorNode.children!.push(taskNode)
          nodeMap.set(task.id, taskNode)
        })

        // 소분류 진행율 계산: 하위 작업들의 평균 진행율
        minorNode.percentComplete = calculateAverageProgress(minorTasks)

        middleNode.children!.push(minorNode)
        nodeMap.set(minorId, minorNode)
      })

      // 중분류 진행율 계산: 하위 소분류들의 평균 진행율
      middleNode.percentComplete = calculateAverageProgress(middleNode.children!)

      majorNode.children!.push(middleNode)
      nodeMap.set(middleId, middleNode)
    })

    // 대분류 진행율 계산: 하위 중분류들의 평균 진행율
    majorNode.percentComplete = calculateAverageProgress(majorNode.children!)

    tree.push(majorNode)
    nodeMap.set(majorId, majorNode)
  })

  return tree
}

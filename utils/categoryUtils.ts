import { Task } from '../types/task'

export interface CategoryHierarchy {
  majorCategories: string[]
  middleCategories: { [majorCategory: string]: string[] }
  minorCategories: { [majorCategory: string]: { [middleCategory: string]: string[] } }
}

/**
 * 대분류 순서를 반환하는 함수 (utils/tree/builder.ts와 동일한 로직)
 */
export const getMajorCategoryOrder = (category: string): number => {
  const prefix = category.charAt(0).toUpperCase()
  const orders: { [key: string]: number } = {
    'B': 1, // B: 사업&기획
    'A': 2, // A: 재무&정산
    'S': 3, // S: 정보보안&법무
    'D': 4, // D: 개발&연동
    'C': 5, // C: 고객관련
    'O': 6  // O: Beta오픈
  }
  return orders[prefix] || 999 // 정의되지 않은 접두사는 맨 뒤로
}

/**
 * 전체 작업 목록에서 카테고리 계층 구조를 추출
 */
export const extractCategoryHierarchy = (tasks: Task[]): CategoryHierarchy => {
  const majorCategories = new Set<string>()
  const middleCategories: { [majorCategory: string]: Set<string> } = {}
  const minorCategories: { [majorCategory: string]: { [middleCategory: string]: Set<string> } } = {}

  tasks.forEach(task => {
    const major = task.majorCategory || '미분류'
    const middle = task.middleCategory || '미분류'
    const minor = task.minorCategory || '미분류'

    // 대분류 추가
    majorCategories.add(major)

    // 중분류 추가
    if (!middleCategories[major]) {
      middleCategories[major] = new Set()
    }
    middleCategories[major].add(middle)

    // 소분류 추가
    if (!minorCategories[major]) {
      minorCategories[major] = {}
    }
    if (!minorCategories[major][middle]) {
      minorCategories[major][middle] = new Set()
    }
    minorCategories[major][middle].add(minor)
  })

  // 대분류 정렬 (Action Item과 동일한 방식)
  const sortedMajorCategories = Array.from(majorCategories).sort((a, b) => {
    const orderA = getMajorCategoryOrder(a)
    const orderB = getMajorCategoryOrder(b)
    
    // 1차 정렬: 기존 정의된 순서 (B->A->S->D->C->O)
    if (orderA !== orderB) {
      return orderA - orderB
    }
    
    // 2차 정렬: 같은 순서 그룹 내에서 알파벳 순 (ascending)
    return a.localeCompare(b)
  })

  // Set을 배열로 변환하고 정렬
  const sortedMiddleCategories: { [majorCategory: string]: string[] } = {}
  const sortedMinorCategories: { [majorCategory: string]: { [middleCategory: string]: string[] } } = {}

  Object.keys(middleCategories).forEach(major => {
    sortedMiddleCategories[major] = Array.from(middleCategories[major]).sort()
    
    sortedMinorCategories[major] = {}
    Object.keys(minorCategories[major] || {}).forEach(middle => {
      sortedMinorCategories[major][middle] = Array.from(minorCategories[major][middle]).sort()
    })
  })

  return {
    majorCategories: sortedMajorCategories,
    middleCategories: sortedMiddleCategories,
    minorCategories: sortedMinorCategories
  }
}

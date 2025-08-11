/**
 * API 요청 처리를 위한 유틸리티 함수
 */

import { Task } from '../../../types/task'

export interface TaskEditData {
  name: string
  startDate: string
  endDate: string
  percentComplete: number
  resource: string
  department: string
}

/**
 * 작업 편집 가능 여부 확인
 */
export const isEditableTask = (task: Task): boolean => {
  return task.level === 2 || (!task.isGroup && !task.hasChildren)
}

/**
 * API 요청 데이터 변환
 */
export const transformTaskUpdateData = (task: Task, editData: TaskEditData) => {
  return {
    name: editData.name,
    start: editData.startDate ? new Date(editData.startDate).toISOString() : task.start.toISOString(),
    end: editData.endDate ? new Date(editData.endDate).toISOString() : task.end.toISOString(),
    percent_complete: editData.percentComplete,
    resource: editData.resource,
    department: editData.department
  }
}

/**
 * API 응답 데이터를 Task 객체로 변환
 */
export const transformApiResponseToTask = (task: Task, apiData: any): Task => {
  return {
    ...task,
    name: apiData.title || apiData.name || task.name, // UI 표시용
    title: apiData.title || apiData.name || task.title || task.name, // DB 저장용
    start: new Date(apiData.start_date),
    end: new Date(apiData.end_date),
    percentComplete: apiData.progress,
    resource: apiData.assignee,
    department: apiData.department
  }
}

/**
 * 로컬 작업 업데이트
 */
export const updateTaskLocally = (task: Task, editData: TaskEditData): Task => {
  return {
    ...task,
    name: editData.name,
    start: editData.startDate ? new Date(editData.startDate) : task.start,
    end: editData.endDate ? new Date(editData.endDate) : task.end,
    percentComplete: editData.percentComplete,
    resource: editData.resource,
    department: editData.department
  }
}

import { useState, useCallback } from 'react'
import { Task } from '../../types/task'

interface AddActionFormData {
  majorCategory: string
  middleCategory: string
  minorCategory: string
  taskName: string
  startDate: string
  endDate: string
  resource: string
  department: string
  percentComplete: number
}

interface UseAddActionFormProps {
  parentTask: Task
}

export const useAddActionForm = ({ parentTask }: UseAddActionFormProps) => {
  const [formData, setFormData] = useState<AddActionFormData>({
    majorCategory: parentTask.majorCategory || '',
    middleCategory: parentTask.middleCategory || '',
    minorCategory: parentTask.minorCategory || '',
    taskName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    resource: '',
    department: '',
    percentComplete: 0
  })

  // 필드 업데이트 함수
  const updateField = useCallback((field: keyof AddActionFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // 폼 유효성 검사
  const validateForm = useCallback((): string | null => {
    if (!formData.taskName.trim()) {
      return '세부업무명을 입력해주세요.'
    }

    if (!formData.startDate || !formData.endDate) {
      return '시작일과 종료일을 입력해주세요.'
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      return '종료일은 시작일보다 늦어야 합니다.'
    }

    return null
  }, [formData])

  // 새 작업 데이터 생성
  const createNewTask = useCallback((): Partial<Task> => {
    return {
      name: formData.taskName,
      detail: formData.taskName,
      majorCategory: formData.majorCategory,
      middleCategory: formData.middleCategory,
      minorCategory: formData.minorCategory,
      start: new Date(formData.startDate),
      end: new Date(formData.endDate),
      resource: formData.resource,
      department: formData.department || '',
      percentComplete: formData.percentComplete || 0,
      level: 2, // 세부업무 레벨
      parentId: parentTask?.id || '',
      category: formData.majorCategory,
      subcategory: formData.middleCategory,
      status: '미완료',
      hasChildren: false,
      isGroup: false
    }
  }, [formData, parentTask])

  // 폼 리셋
  const resetForm = useCallback(() => {
    setFormData({
      majorCategory: parentTask.majorCategory || '',
      middleCategory: parentTask.middleCategory || '',
      minorCategory: parentTask.minorCategory || '',
      taskName: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      resource: '',
      department: '',
      percentComplete: 0
    })
  }, [parentTask])

  return {
    formData,
    updateField,
    validateForm,
    createNewTask,
    resetForm
  }
}

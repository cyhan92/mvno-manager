import { useState, useEffect } from 'react'
import { Task } from '../../types/task'

interface TaskEditData {
  name: string
  startDate: string
  endDate: string
  percentComplete: number
  resource: string
  department: string
  majorCategory: string
  middleCategory: string
  minorCategory: string
  status: string
  detail: string
}

interface UseTaskEditFormProps {
  task: Task
  isEditing: boolean
}

export const useTaskEditForm = ({ task, isEditing }: UseTaskEditFormProps) => {
  const [editData, setEditData] = useState<TaskEditData>({
    name: '',
    startDate: '',
    endDate: '',
    percentComplete: 0,
    resource: '',
    department: '',
    majorCategory: '',
    middleCategory: '',
    minorCategory: '',
    status: '미완료',
    detail: ''
  })

  // Initialize edit data when task changes or editing starts
  useEffect(() => {
    if (task) {
      setEditData({
        name: task.name || '',
        startDate: task.start ? task.start.toISOString().split('T')[0] : '',
        endDate: task.end ? task.end.toISOString().split('T')[0] : '',
        percentComplete: task.percentComplete || 0,
        resource: task.resource || '',
        department: task.department || '',
        majorCategory: task.majorCategory || '',
        middleCategory: task.middleCategory || '',
        minorCategory: task.minorCategory || '',
        status: task.status || '미완료',
        detail: task.detail || ''
      })
    }
  }, [task, isEditing])

  // 개별 필드 업데이트 함수들
  const updateField = <K extends keyof TaskEditData>(
    field: K,
    value: TaskEditData[K]
  ) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }

  // 진행률과 상태를 함께 업데이트하는 특별 함수
  const updateProgress = (progress: number, status: string) => {
    setEditData(prev => ({
      ...prev,
      percentComplete: progress,
      status
    }))
  }

  // 카테고리 업데이트 함수들
  const updateMajorCategory = (value: string) => updateField('majorCategory', value)
  const updateMiddleCategory = (value: string) => updateField('middleCategory', value)
  const updateMinorCategory = (value: string) => updateField('minorCategory', value)

  // 폼 데이터 리셋
  const resetForm = () => {
    setEditData({
      name: task.name || '',
      startDate: task.start ? task.start.toISOString().split('T')[0] : '',
      endDate: task.end ? task.end.toISOString().split('T')[0] : '',
      percentComplete: task.percentComplete || 0,
      resource: task.resource || '',
      department: task.department || '',
      majorCategory: task.majorCategory || '',
      middleCategory: task.middleCategory || '',
      minorCategory: task.minorCategory || '',
      status: task.status || '미완료',
      detail: task.detail || ''
    })
  }

  // 폼 유효성 검사
  const isValid = () => {
    return editData.name.trim().length > 0 && 
           editData.startDate.length > 0 && 
           editData.endDate.length > 0
  }

  return {
    editData,
    updateField,
    updateProgress,
    updateMajorCategory,
    updateMiddleCategory,
    updateMinorCategory,
    resetForm,
    isValid
  }
}

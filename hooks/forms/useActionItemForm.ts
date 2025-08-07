import { useState } from 'react'
import { Task } from '../../types/task'

interface FormData {
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

interface UseActionItemFormProps {
  parentTask: Task
  onAdd: (newTask: Partial<Task>) => void
  onClose: () => void
}

export const useActionItemForm = ({ parentTask, onAdd, onClose }: UseActionItemFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    majorCategory: parentTask.majorCategory || '',
    middleCategory: parentTask.middleCategory || '',
    minorCategory: parentTask.minorCategory || '',
    taskName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7일 후
    resource: '',
    department: '',
    percentComplete: 0
  })

  const updateFormData = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = (): string | null => {
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
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const error = validateForm()
    if (error) {
      alert(error)
      return
    }

    // 새 작업 데이터 생성
    const newTask: Partial<Task> = {
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
      status: '미완료', // 데이터베이스 제약조건에 맞는 값으로 설정
      hasChildren: false,
      isGroup: false
    }

    onAdd(newTask)
    onClose()
  }

  return {
    formData,
    updateFormData,
    handleSubmit
  }
}

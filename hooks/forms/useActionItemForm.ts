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
  // parentTask 유효성 검사
  if (!parentTask) {
    console.error('useActionItemForm: parentTask is required')
    return {
      formData: {} as FormData,
      updateFormData: () => {},
      handleSubmit: () => {}
    }
  }

  const [formData, setFormData] = useState<FormData>({
    majorCategory: parentTask.majorCategory || '',
    middleCategory: parentTask.middleCategory || '',
    minorCategory: parentTask.minorCategory || '',
    taskName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7일 후
    resource: '미정',
    department: '미정',
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

    try {
      // 더 고유한 ID 생성 (타임스탬프 + 랜덤 문자열)
      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substr(2, 9)
      const uniqueId = `task_${timestamp}_${randomStr}`
      
      // 새 작업 데이터 생성
      const newTask: Partial<Task> = {
        id: uniqueId,
        name: formData.taskName.trim(),
        detail: '', // 기본값을 빈 문자열로 설정
        majorCategory: formData.majorCategory || parentTask.majorCategory || '',
        middleCategory: formData.middleCategory || parentTask.middleCategory || '',
        minorCategory: formData.minorCategory || parentTask.minorCategory || '',
        start: new Date(formData.startDate),
        end: new Date(formData.endDate),
        resource: formData.resource.trim() || '',
        department: formData.department.trim() || '',
        percentComplete: Number(formData.percentComplete) || 0,
        level: 2, // 세부업무 레벨
        parentId: parentTask?.id || '',
        category: formData.majorCategory || parentTask.majorCategory || '',
        subcategory: formData.middleCategory || parentTask.middleCategory || '',
        status: '미완료', // 데이터베이스 제약조건에 맞는 값으로 설정
        hasChildren: false,
        isGroup: false,
        // 추가 필수 필드들
        duration: null,
        dependencies: null,
        cost: '',
        notes: ''
      }

      console.log('새 작업 데이터 생성:', newTask)
      onAdd(newTask)
      onClose()
    } catch (error) {
      console.error('작업 추가 중 오류 발생:', error)
      alert('작업 추가 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return {
    formData,
    updateFormData,
    handleSubmit
  }
}

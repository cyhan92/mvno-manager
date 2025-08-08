import { Task } from '../../types/task'
import { ActionItemPopupStates } from './useActionItemPopups'

export interface ActionItemHandlersProps {
  popupStates: ActionItemPopupStates
  popupSetters: {
    setContextMenu: React.Dispatch<React.SetStateAction<any>>
    setAddPopup: React.Dispatch<React.SetStateAction<any>>
    setEditMajorCategoryPopup: React.Dispatch<React.SetStateAction<any>>
    setEditSubCategoryPopup: React.Dispatch<React.SetStateAction<any>>
    setAddMajorCategoryPopup: React.Dispatch<React.SetStateAction<any>>
    setDeleteConfirmationPopup: React.Dispatch<React.SetStateAction<any>>
    setMoveMajorCategoryPopup: React.Dispatch<React.SetStateAction<any>>
  }
  onTaskAdd?: (newTask: Partial<Task>) => void
  onSubCategoryUpdate?: (taskId: string, middleCategory: string, subCategory: string, currentMiddleCategory?: string, currentSubCategory?: string) => Promise<void>
  onOpenTaskDetailPopup?: (task: Task, position: { x: number; y: number }) => void
  onMoveMajorCategory?: (currentMajorCategory: string, currentMinorCategory: string, targetMajorCategory: string) => Promise<{ success: boolean; updatedCount: number }>
}

export const useActionItemHandlers = ({
  popupStates,
  popupSetters,
  onTaskAdd,
  onSubCategoryUpdate,
  onOpenTaskDetailPopup,
  onMoveMajorCategory
}: ActionItemHandlersProps) => {
  const {
    setContextMenu,
    setAddPopup,
    setEditMajorCategoryPopup,
    setEditSubCategoryPopup,
    setAddMajorCategoryPopup,
    setDeleteConfirmationPopup,
    setMoveMajorCategoryPopup
  } = popupSetters

  // 우클릭 이벤트 핸들러
  const handleContextMenu = (e: React.MouseEvent, task: Task) => {
    e.preventDefault()
    
    // 대분류(level 0), 소분류(level 1), 상세업무(level 2)에서 컨텍스트 메뉴 표시
    if (task.level === 0 || task.level === 1 || task.level === 2) {
      setContextMenu({
        isOpen: true,
        position: { x: e.clientX, y: e.clientY },
        task
      })
    }
  }

  // 컨텍스트 메뉴 닫기
  const handleCloseContextMenu = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      task: null
    })
  }

  // Add Action Item 팝업 열기
  const handleOpenAddPopup = () => {
    if (popupStates.contextMenu.task) {
      setAddPopup({
        isOpen: true,
        position: { x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 300 },
        parentTask: popupStates.contextMenu.task
      })
    }
  }

  // Add Action Item 팝업 닫기
  const handleCloseAddPopup = () => {
    setAddPopup({
      isOpen: false,
      position: { x: 0, y: 0 },
      parentTask: null
    })
  }

  // Edit Major Category 팝업 열기
  const handleOpenEditMajorCategoryPopup = () => {
    if (popupStates.contextMenu.task) {
      setEditMajorCategoryPopup({
        isOpen: true,
        position: { x: window.innerWidth / 2 - 250, y: window.innerHeight / 2 - 200 },
        task: popupStates.contextMenu.task
      })
    }
  }

  // Edit Major Category 팝업 닫기
  const handleCloseEditMajorCategoryPopup = () => {
    setEditMajorCategoryPopup({
      isOpen: false,
      position: { x: 0, y: 0 },
      task: null
    })
  }

  // Edit Sub Category 팝업 열기
  const handleEditSubCategory = () => {
    console.log(`🎯 ActionItemList: handleEditSubCategory 호출`)
    console.log(`📋 선택된 태스크:`, popupStates.contextMenu.task)
    console.log(`📋 태스크 상세 정보:`, {
      id: popupStates.contextMenu.task?.id,
      name: popupStates.contextMenu.task?.name,
      middleCategory: popupStates.contextMenu.task?.middleCategory,
      minorCategory: popupStates.contextMenu.task?.minorCategory,
      majorCategory: popupStates.contextMenu.task?.majorCategory,
      level: popupStates.contextMenu.task?.level,
      isGroup: popupStates.contextMenu.task?.isGroup
    })
    
    if (popupStates.contextMenu.task) {
      setEditSubCategoryPopup({
        isOpen: true,
        task: popupStates.contextMenu.task
      })
    }
  }

  // Edit Sub Category 팝업 닫기
  const handleCloseEditSubCategoryPopup = () => {
    setEditSubCategoryPopup({
      isOpen: false,
      task: null
    })
  }

  // Add Major Category 팝업 열기
  const handleOpenAddMajorCategoryPopup = () => {
    setAddMajorCategoryPopup({
      isOpen: true
    })
  }

  // Add Major Category 팝업 닫기
  const handleCloseAddMajorCategoryPopup = () => {
    setAddMajorCategoryPopup({
      isOpen: false
    })
  }

  // 상세업무 수정 핸들러 (더블클릭과 동일)
  const handleEditTask = () => {
    if (popupStates.contextMenu.task && onOpenTaskDetailPopup) {
      // 컨텍스트 메뉴 위치를 기반으로 팝업 열기
      onOpenTaskDetailPopup(popupStates.contextMenu.task, {
        x: popupStates.contextMenu.position.x + 10,
        y: popupStates.contextMenu.position.y
      })
    }
  }

  // 상세업무 삭제 핸들러
  const handleDeleteTask = () => {
    if (popupStates.contextMenu.task) {
      setDeleteConfirmationPopup({
        isOpen: true,
        task: popupStates.contextMenu.task,
        isLoading: false
      })
    }
  }

  // Delete Confirmation 팝업 닫기
  const handleCloseDeleteConfirmationPopup = () => {
    setDeleteConfirmationPopup({
      isOpen: false,
      task: null,
      isLoading: false
    })
  }

  // Move Major Category 팝업 열기
  const handleMoveMajorCategory = () => {
    if (popupStates.contextMenu.task) {
      setMoveMajorCategoryPopup({
        isOpen: true,
        task: popupStates.contextMenu.task
      })
    }
  }

  // Move Major Category 팝업 닫기
  const handleCloseMoveMajorCategoryPopup = () => {
    setMoveMajorCategoryPopup({
      isOpen: false,
      task: null
    })
  }

  // 대분류 이동 실행
  const handleExecuteMoveMajorCategory = async (targetMajorCategory: string) => {
    if (!popupStates.moveMajorCategoryPopup.task || !onMoveMajorCategory) {
      throw new Error('필요한 정보가 없습니다.')
    }

    const task = popupStates.moveMajorCategoryPopup.task
    
    if (!task.majorCategory || !task.minorCategory) {
      const error = '대분류 또는 소분류 정보가 없습니다.'
      alert(error)
      throw new Error(error)
    }

    try {
      const result = await onMoveMajorCategory(
        task.majorCategory,
        task.minorCategory,
        targetMajorCategory
      )

      console.log('✅ 대분류 이동 완료:', result)
      // 성공 시에는 팝업을 표시하지 않음 (로그만 출력)
      
    } catch (error) {
      console.error('❌ 대분류 이동 실패:', error)
      const errorMessage = `대분류 이동 중 오류가 발생했습니다: ${error}`
      alert(errorMessage)
      throw error // 에러를 다시 throw하여 상위 컴포넌트에서 처리할 수 있도록 함
    }
  }

  // 중분류,소분류 수정 핸들러
  const handleSubCategoryUpdate = async (taskId: string, middleCategory: string, subCategory: string, currentMiddleCategory?: string, currentSubCategory?: string) => {
    console.log(`🎯 ActionItemList: handleSubCategoryUpdate 호출`)
    console.log(`📋 파라미터:`, { taskId, middleCategory, subCategory, currentMiddleCategory, currentSubCategory })
    console.log(`🔗 onSubCategoryUpdate 함수 존재:`, !!onSubCategoryUpdate)
    
    if (onSubCategoryUpdate) {
      try {
        console.log(`🚀 상위 onSubCategoryUpdate 함수 호출`)
        await onSubCategoryUpdate(taskId, middleCategory, subCategory, currentMiddleCategory, currentSubCategory)
        console.log(`✅ 상위 함수 호출 완료`)
        // 성공시 팝업 닫기
        handleCloseEditSubCategoryPopup()
      } catch (error) {
        console.error('❌ 중분류,소분류 수정 실패:', error)
      }
    } else {
      console.warn(`⚠️ onSubCategoryUpdate 함수가 전달되지 않았습니다`)
    }
  }

  // 새로운 Task 추가 핸들러
  const handleAddTask = (newTask: Partial<Task>) => {
    try {
      console.log('ActionItemList: 새 작업 추가 요청:', newTask)
      
      if (!newTask) {
        throw new Error('새 작업 데이터가 없습니다.')
      }

      if (!newTask.name || !newTask.name.trim()) {
        throw new Error('작업명이 필요합니다.')
      }

      if (onTaskAdd) {
        onTaskAdd(newTask)
        console.log('ActionItemList: 새 작업 추가 완료')
        
        // 팝업 닫기
        handleCloseAddPopup()
      } else {
        console.warn('ActionItemList: onTaskAdd 함수가 전달되지 않았습니다.')
      }
    } catch (error) {
      console.error('ActionItemList: 새 작업 추가 실패:', error)
      alert(`작업 추가 중 오류가 발생했습니다: ${error}`)
    }
  }

  return {
    handleContextMenu,
    handleCloseContextMenu,
    handleOpenAddPopup,
    handleCloseAddPopup,
    handleOpenEditMajorCategoryPopup,
    handleCloseEditMajorCategoryPopup,
    handleEditSubCategory,
    handleCloseEditSubCategoryPopup,
    handleOpenAddMajorCategoryPopup,
    handleCloseAddMajorCategoryPopup,
    handleEditTask,
    handleDeleteTask,
    handleCloseDeleteConfirmationPopup,
    handleMoveMajorCategory,
    handleCloseMoveMajorCategoryPopup,
    handleExecuteMoveMajorCategory,
    handleSubCategoryUpdate,
    handleAddTask
  }
}

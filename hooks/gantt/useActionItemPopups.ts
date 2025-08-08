import { useState } from 'react'
import { Task } from '../../types/task'

// 팝업 상태 인터페이스들
interface ContextMenuState {
  isOpen: boolean
  position: { x: number; y: number }
  task: Task | null
}

interface AddPopupState {
  isOpen: boolean
  position: { x: number; y: number }
  parentTask: Task | null
}

interface EditMajorCategoryPopupState {
  isOpen: boolean
  position: { x: number; y: number }
  task: Task | null
}

interface EditSubCategoryPopupState {
  isOpen: boolean
  task: Task | null
}

interface AddMajorCategoryPopupState {
  isOpen: boolean
}

interface DeleteConfirmationPopupState {
  isOpen: boolean
  task: Task | null
  isLoading: boolean
}

interface MoveMajorCategoryPopupState {
  isOpen: boolean
  task: Task | null
}

export interface ActionItemPopupStates {
  contextMenu: ContextMenuState
  addPopup: AddPopupState
  editMajorCategoryPopup: EditMajorCategoryPopupState
  editSubCategoryPopup: EditSubCategoryPopupState
  addMajorCategoryPopup: AddMajorCategoryPopupState
  deleteConfirmationPopup: DeleteConfirmationPopupState
  moveMajorCategoryPopup: MoveMajorCategoryPopupState
}

export const useActionItemPopups = () => {
  // 컨텍스트 메뉴 상태
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    task: null
  })

  // Add Action Item 팝업 상태
  const [addPopup, setAddPopup] = useState<AddPopupState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    parentTask: null
  })

  // Edit Major Category 팝업 상태
  const [editMajorCategoryPopup, setEditMajorCategoryPopup] = useState<EditMajorCategoryPopupState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    task: null
  })

  // Edit Sub Category 팝업 상태
  const [editSubCategoryPopup, setEditSubCategoryPopup] = useState<EditSubCategoryPopupState>({
    isOpen: false,
    task: null
  })

  // Add Major Category 팝업 상태
  const [addMajorCategoryPopup, setAddMajorCategoryPopup] = useState<AddMajorCategoryPopupState>({
    isOpen: false
  })

  // Delete Confirmation 팝업 상태
  const [deleteConfirmationPopup, setDeleteConfirmationPopup] = useState<DeleteConfirmationPopupState>({
    isOpen: false,
    task: null,
    isLoading: false
  })

  // Move Major Category 팝업 상태
  const [moveMajorCategoryPopup, setMoveMajorCategoryPopup] = useState<MoveMajorCategoryPopupState>({
    isOpen: false,
    task: null
  })

  const popupStates: ActionItemPopupStates = {
    contextMenu,
    addPopup,
    editMajorCategoryPopup,
    editSubCategoryPopup,
    addMajorCategoryPopup,
    deleteConfirmationPopup,
    moveMajorCategoryPopup
  }

  const popupSetters = {
    setContextMenu,
    setAddPopup,
    setEditMajorCategoryPopup,
    setEditSubCategoryPopup,
    setAddMajorCategoryPopup,
    setDeleteConfirmationPopup,
    setMoveMajorCategoryPopup
  }

  return {
    popupStates,
    popupSetters
  }
}

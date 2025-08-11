import React from 'react'
import { Task } from '../../types/task'
import { ActionItemPopupStates } from '../../hooks/gantt/useActionItemPopups'
import ContextMenu from './ContextMenu'
import MoveMajorCategoryPopup from './MoveMajorCategoryPopup'
import AddActionItemPopupRefactored from './AddActionItemPopupRefactored'
import EditMajorCategoryPopup from './EditMajorCategoryPopup'
import SubCategoryEditPopup from './SubCategoryEditPopup'
import AddMajorCategoryPopup from './AddMajorCategoryPopup'
import DeleteConfirmationPopup from './DeleteConfirmationPopup'

interface ActionItemPopupsProps {
  popupStates: ActionItemPopupStates
  displayTasks: Task[]
  handlers: {
    handleCloseContextMenu: () => void
    handleOpenAddPopup: () => void
    handleOpenEditMajorCategoryPopup: () => void
    handleEditSubCategory: () => void
    handleAddSubCategory: () => void
    handleOpenAddMajorCategoryPopup: () => void
    handleEditTask: () => void
    handleDeleteTask: () => void
    handleMoveMajorCategory: () => void
    handleCloseAddPopup: () => void
    handleAddTask: (newTask: Partial<Task>) => void
    handleCloseEditMajorCategoryPopup: () => void
    handleMajorCategoryUpdate: (oldCategory: string, newCategory: string) => Promise<void>
    handleCloseEditSubCategoryPopup: () => void
    handleSubCategoryUpdate: (taskId: string, middleCategory: string, subCategory: string, currentMiddleCategory?: string, currentSubCategory?: string) => Promise<void>
    handleCloseAddSubCategoryPopup: () => void
    handleCloseAddMajorCategoryPopup: () => void
    handleAddMajorCategory: (newCategory: string) => Promise<void>
    handleCloseDeleteConfirmationPopup: () => void
    handleConfirmDelete: () => void
    handleCloseMoveMajorCategoryPopup: () => void
    handleExecuteMoveMajorCategory: (targetMajorCategory: string) => Promise<void>
  }
  addSubCategoryPopup: {
    isOpen: boolean
    task: Task | null
  }
}

const ActionItemPopups: React.FC<ActionItemPopupsProps> = ({
  popupStates,
  displayTasks,
  handlers,
  addSubCategoryPopup
}) => {
  return (
    <>
      {/* 컨텍스트 메뉴 */}
      <ContextMenu
        isOpen={popupStates.contextMenu.isOpen}
        position={popupStates.contextMenu.position}
        task={popupStates.contextMenu.task}
        onClose={handlers.handleCloseContextMenu}
        onAddActionItem={handlers.handleOpenAddPopup}
        onEditMajorCategory={handlers.handleOpenEditMajorCategoryPopup}
        onEditSubCategory={handlers.handleEditSubCategory}
        onAddSubCategory={handlers.handleAddSubCategory}
        onAddMajorCategory={handlers.handleOpenAddMajorCategoryPopup}
        onEditTask={handlers.handleEditTask}
        onDeleteTask={handlers.handleDeleteTask}
        onMoveMajorCategory={handlers.handleMoveMajorCategory}
      />

      {/* Add Action Item 팝업 */}
      {popupStates.addPopup.parentTask && (
        <AddActionItemPopupRefactored
          isOpen={popupStates.addPopup.isOpen}
          position={popupStates.addPopup.position}
          parentTask={popupStates.addPopup.parentTask}
          onClose={handlers.handleCloseAddPopup}
          onAdd={handlers.handleAddTask}
        />
      )}

      {/* Edit Major Category 팝업 */}
      {popupStates.editMajorCategoryPopup.task && (
        <EditMajorCategoryPopup
          isOpen={popupStates.editMajorCategoryPopup.isOpen}
          position={popupStates.editMajorCategoryPopup.position}
          task={popupStates.editMajorCategoryPopup.task}
          onClose={handlers.handleCloseEditMajorCategoryPopup}
          onSave={handlers.handleMajorCategoryUpdate}
        />
      )}

      {/* Edit Sub Category 팝업 */}
      {popupStates.editSubCategoryPopup.task && (
        <SubCategoryEditPopup
          isOpen={popupStates.editSubCategoryPopup.isOpen}
          task={popupStates.editSubCategoryPopup.task}
          currentMiddleCategory={popupStates.editSubCategoryPopup.task.middleCategory}
          currentSubCategory={popupStates.editSubCategoryPopup.task.minorCategory}
          onClose={handlers.handleCloseEditSubCategoryPopup}
          onUpdateSubCategory={handlers.handleSubCategoryUpdate}
          mode={popupStates.editSubCategoryPopup.mode}
          onAddTask={handlers.handleAddTask}
        />
      )}

      {/* Add Sub Category 팝업 */}
      {addSubCategoryPopup.task && (
        <SubCategoryEditPopup
          isOpen={addSubCategoryPopup.isOpen}
          task={addSubCategoryPopup.task}
          currentMiddleCategory={addSubCategoryPopup.task.middleCategory}
          currentSubCategory=""
          onClose={handlers.handleCloseAddSubCategoryPopup}
          onUpdateSubCategory={handlers.handleSubCategoryUpdate}
          mode="add"
          onAddTask={handlers.handleAddTask}
        />
      )}

      {/* Add Major Category 팝업 */}
      <AddMajorCategoryPopup
        isOpen={popupStates.addMajorCategoryPopup.isOpen}
        onClose={handlers.handleCloseAddMajorCategoryPopup}
        onAdd={handlers.handleAddMajorCategory}
      />

      {/* Delete Confirmation 팝업 */}
      {popupStates.deleteConfirmationPopup.task && (
        <DeleteConfirmationPopup
          isOpen={popupStates.deleteConfirmationPopup.isOpen}
          task={popupStates.deleteConfirmationPopup.task}
          onClose={handlers.handleCloseDeleteConfirmationPopup}
          onConfirm={handlers.handleConfirmDelete}
          isLoading={popupStates.deleteConfirmationPopup.isLoading}
        />
      )}

      {/* Move Major Category 팝업 */}
      {popupStates.moveMajorCategoryPopup.task && (
        <MoveMajorCategoryPopup
          isOpen={popupStates.moveMajorCategoryPopup.isOpen}
          task={popupStates.moveMajorCategoryPopup.task}
          tasks={displayTasks}
          onClose={handlers.handleCloseMoveMajorCategoryPopup}
          onMove={handlers.handleExecuteMoveMajorCategory}
        />
      )}
    </>
  )
}

export default ActionItemPopups

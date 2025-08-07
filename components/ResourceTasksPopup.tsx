import React, { useState } from 'react'
import { Task } from '../types/task'
import styles from '../styles/task-detail-popup.module.css'
import TaskDetailPopupRefactored from './gantt/TaskDetailPopupRefactored'

interface ResourceTasksPopupProps {
  resource: string
  tasks: Task[]
  isOpen: boolean
  onClose: () => void
  onTaskUpdate?: (updatedTask: Task) => void
}

const ResourceTasksPopup: React.FC<ResourceTasksPopupProps> = ({
  resource,
  tasks,
  isOpen,
  onClose,
  onTaskUpdate
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)

  if (!isOpen) return null

  // 작업 더블클릭 핸들러
  const handleTaskDoubleClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  // 작업 상세 팝업 닫기
  const closeTaskDetail = () => {
    setIsTaskDetailOpen(false)
    setSelectedTask(null)
  }

  // 작업 업데이트 핸들러
  const handleTaskUpdate = (updatedTask: Task) => {
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask)
    }
    closeTaskDetail()
  }

  // 작업을 완료/미완료로 분류
  const completedTasks = tasks.filter(task => (task.percentComplete || 0) >= 100)
  const incompleteTasks = tasks.filter(task => (task.percentComplete || 0) < 100)

  // 작업을 계층 구조로 표시하기 위한 함수 (대분류 > 소분류 > 세부업무)
  const getTaskHierarchy = (task: Task) => {
    const hierarchy = []
    
    // 대분류
    if (task.majorCategory) {
      hierarchy.push(task.majorCategory)
    } else if (task.category) {
      hierarchy.push(task.category)
    }
    
    // 소분류 (중분류는 건너뛰고 소분류만 표시)
    if (task.minorCategory) {
      hierarchy.push(task.minorCategory)
    } else if (task.department && task.department !== (task.majorCategory || task.category)) {
      hierarchy.push(task.department)
    }
    
    // 세부업무 (작업명)
    if (task.name) {
      hierarchy.push(task.name)
    } else if (task.detail) {
      hierarchy.push(task.detail)
    }
    
    return hierarchy
  }

  const TaskItem: React.FC<{ task: Task; isCompleted: boolean }> = ({ task, isCompleted }) => {
    const hierarchy = getTaskHierarchy(task)
    const progress = task.percentComplete || 0
    
    return (
      <div 
        className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${isCompleted ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'}`}
        onDoubleClick={() => handleTaskDoubleClick(task)}
        title="더블클릭하여 상세 정보 보기"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            {/* 계층 구조 표시 */}
            <div className="text-xs text-gray-500 mb-1">
              {hierarchy.length > 1 ? (
                <span>{hierarchy.slice(0, -1).join(' > ')}</span>
              ) : (
                <span>기타</span>
              )}
            </div>
            {/* 세부업무명 */}
            <div className="font-medium text-gray-900">
              {hierarchy[hierarchy.length - 1] || '업무명 없음'}
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isCompleted 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isCompleted ? '✅ 완료' : '⏳ 진행중'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {progress}% 완료
            </div>
          </div>
        </div>
        
        {/* 진행률 바 */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-yellow-500'} ${styles.resourceTaskProgressFill}`}
            // eslint-disable-next-line react/forbid-dom-props
            style={{
              '--progress-width': `${progress}%`
            } as React.CSSProperties}
          />
        </div>
        
        {/* 상세 정보 */}
        {task.detail && task.detail !== task.name && (
          <div className="text-xs text-gray-600 mt-2">
            {task.detail}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* 팝업 */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          {/* 헤더 */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              👤 {resource} 담당 업무 현황
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
          
          {/* 통계 요약 */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                <div className="text-sm text-gray-600">총 업무</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                <div className="text-sm text-gray-600">완료</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{incompleteTasks.length}</div>
                <div className="text-sm text-gray-600">진행중</div>
              </div>
            </div>
          </div>
          
          {/* 업무 목록 */}
          <div className="p-6 overflow-y-auto max-h-96">
            {tasks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                할당된 업무가 없습니다.
              </div>
            ) : (
              <div className="space-y-6">
                {/* 미완료 업무 */}
                {incompleteTasks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      ⏳ 진행중인 업무 ({incompleteTasks.length}개)
                    </h3>
                    <div className="space-y-3">
                      {incompleteTasks.map((task) => (
                        <TaskItem key={task.id} task={task} isCompleted={false} />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 완료 업무 */}
                {completedTasks.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      ✅ 완료된 업무 ({completedTasks.length}개)
                    </h3>
                    <div className="space-y-3">
                      {completedTasks.map((task) => (
                        <TaskItem key={task.id} task={task} isCompleted={true} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* 푸터 */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>💡 팁: 업무를 더블클릭하면 상세 정보를 확인할 수 있습니다.</span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 작업 상세 팝업 */}
      {selectedTask && (
        <TaskDetailPopupRefactored
          task={selectedTask}
          position={{ x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 250 }}
          onClose={closeTaskDetail}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </>
  )
}

export default ResourceTasksPopup

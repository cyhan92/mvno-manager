import React, { useState, useEffect, useRef } from 'react'
import { Task } from '../types/task'
import styles from '../styles/task-detail-popup.module.css'
import TaskDetailPopupRefactored from './gantt/TaskDetailPopupRefactored'
import { getMajorCategoryOrder } from '../utils/tree/builder'

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
  // 섹션별 대분류 펼침 상태
  const [expandedInProgressMajors, setExpandedInProgressMajors] = useState<Set<string>>(new Set())
  const [expandedNotStartedMajors, setExpandedNotStartedMajors] = useState<Set<string>>(new Set())
  const [expandedCompletedMajors, setExpandedCompletedMajors] = useState<Set<string>>(new Set())

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

  // 작업을 상태별로 분류
  const completedTasks = tasks.filter(task => (task.percentComplete || 0) >= 100)
  const notStartedTasks = tasks.filter(task => (task.percentComplete || 0) === 0)
  const inProgressTasks = tasks.filter(task => {
    const p = task.percentComplete || 0
    return p > 0 && p < 100
  })

  // 공통: 대분류별 그룹핑 유틸
  const groupByMajorCategory = (targetTasks: Task[]) => {
    const grouped: Record<string, Task[]> = {}
    targetTasks.forEach(task => {
      const majorCategory = task.majorCategory || task.category || '기타'
      if (!grouped[majorCategory]) grouped[majorCategory] = []
      grouped[majorCategory].push(task)
    })
    return grouped
  }

  const groupedInProgress = groupByMajorCategory(inProgressTasks)
  const groupedNotStarted = groupByMajorCategory(notStartedTasks)
  const groupedCompleted = groupByMajorCategory(completedTasks)

  // 섹션별 대분류 펼치기/접기 토글 및 일괄 처리
  const toggleMajor = (section: 'inProgress' | 'notStarted' | 'completed', majorCategory: string) => {
    const map = {
      inProgress: [expandedInProgressMajors, setExpandedInProgressMajors] as const,
      notStarted: [expandedNotStartedMajors, setExpandedNotStartedMajors] as const,
      completed: [expandedCompletedMajors, setExpandedCompletedMajors] as const,
    }
    const [set, setter] = map[section]
    const next = new Set(set)
    if (next.has(majorCategory)) next.delete(majorCategory)
    else next.add(majorCategory)
    setter(next)
  }

  const expandAll = (section: 'inProgress' | 'notStarted' | 'completed') => {
    const map = {
      inProgress: [groupedInProgress, setExpandedInProgressMajors] as const,
      notStarted: [groupedNotStarted, setExpandedNotStartedMajors] as const,
      completed: [groupedCompleted, setExpandedCompletedMajors] as const,
    }
    const [grouped, setter] = map[section]
    setter(new Set(Object.keys(grouped)))
  }

  const collapseAll = (section: 'inProgress' | 'notStarted' | 'completed') => {
    const map = {
      inProgress: setExpandedInProgressMajors,
      notStarted: setExpandedNotStartedMajors,
      completed: setExpandedCompletedMajors,
    }
    map[section](new Set())
  }

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
    const progressRef = useRef<HTMLDivElement>(null)
    const isCompletedByProgress = progress >= 100
    const isNotStarted = progress === 0
    const isInProgress = progress > 0 && progress < 100
    const statusLabel = isCompletedByProgress ? '✅ 완료' : isNotStarted ? '🛌 미시작' : '⏳ 진행중'
    const badgeClass = isCompletedByProgress
      ? 'bg-green-100 text-green-800'
      : isNotStarted
        ? 'bg-gray-100 text-gray-700'
        : 'bg-yellow-100 text-yellow-800'
    const cardClass = isCompletedByProgress
      ? 'bg-green-50 border-green-200 hover:bg-green-100'
      : isNotStarted
        ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
        : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
    const progressBarColor = isCompletedByProgress ? 'bg-green-500' : isNotStarted ? 'bg-gray-300' : 'bg-yellow-500'
    
    useEffect(() => {
      if (progressRef.current) {
  // 진행률 바 width를 단일 CSS 변수로 설정하여 레이아웃 계산을 간소화
  progressRef.current.style.setProperty('--progress-width', `${progress}%`)
      }
    }, [progress])
    
    return (
      <div 
        className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all ${cardClass}`}
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
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
              {statusLabel}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {progress}% 완료
            </div>
          </div>
        </div>
        
        {/* 진행률 바 */}
  <div className={`w-full bg-gray-200 rounded-full h-1.5 ${styles.taskDetailProgressContainer}`}>
          <div 
            ref={progressRef}
            className={`h-1.5 rounded-full ${progressBarColor} ${styles.resourceTaskProgressFill}`}
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
                  <div className="text-2xl font-bold text-yellow-600">{inProgressTasks.length}</div>
                <div className="text-sm text-gray-600">진행중</div>
              </div>
            </div>
          </div>
          
          {/* 업무 목록 */}
          <div className={`p-6 max-h-96 ${styles.listScroll}`}>
            {tasks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                할당된 업무가 없습니다.
              </div>
            ) : (
              <div className="space-y-6">
                {/* 진행중 업무 - 대분류별 그룹핑 */}
                {Object.keys(groupedInProgress).length > 0 && (
                  <div>
                    <div className={`flex justify-between items-center mb-3 ${styles.sectionHeader}`}>
                      <h3 className="text-lg font-semibold text-gray-900">
                        ⏳ 진행중인 업무 ({inProgressTasks.length}개)
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => expandAll('inProgress')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        >
                          모두 펼치기
                        </button>
                        <button
                          onClick={() => collapseAll('inProgress')}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                        >
                          모두 접기
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(groupedInProgress)
                        .sort(([a], [b]) => {
                          const orderA = getMajorCategoryOrder(a)
                          const orderB = getMajorCategoryOrder(b)
                          if (orderA !== orderB) return orderA - orderB
                          return a.localeCompare(b)
                        })
                        .map(([majorCategory, categoryTasks]) => (
                        <div key={majorCategory} className={`border border-gray-200 rounded-lg overflow-hidden ${styles.categoryGroup}`}>
                          {/* 대분류 헤더 */}
                          <div 
                            className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer hover:bg-gray-150 transition-colors"
                            onClick={() => toggleMajor('inProgress', majorCategory)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {expandedInProgressMajors.has(majorCategory) ? '📂' : '📁'}
                              </span>
                              <span className="font-medium text-gray-900">{majorCategory}</span>
                              <span className="text-sm text-gray-500">({categoryTasks.length}개)</span>
                            </div>
                            <span className="text-gray-400">
                              {expandedInProgressMajors.has(majorCategory) ? '▼' : '▶'}
                            </span>
                          </div>
                          
                          {/* 대분류별 업무 목록 */}
                          {expandedInProgressMajors.has(majorCategory) && (
                            <div className="p-3 space-y-3 bg-white">
                              {categoryTasks.map((task) => (
                                <TaskItem key={task.id} task={task} isCompleted={false} />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 미시작 업무 - 대분류별 그룹핑 */}
                {Object.keys(groupedNotStarted).length > 0 && (
                  <div>
                    <div className={`flex justify-between items-center mb-3 ${styles.sectionHeader}`}>
                      <h3 className="text-lg font-semibold text-gray-900">
                        💤 미시작 업무 ({notStartedTasks.length}개)
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => expandAll('notStarted')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        >
                          모두 펼치기
                        </button>
                        <button
                          onClick={() => collapseAll('notStarted')}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                        >
                          모두 접기
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(groupedNotStarted)
                        .sort(([a], [b]) => {
                          const orderA = getMajorCategoryOrder(a)
                          const orderB = getMajorCategoryOrder(b)
                          if (orderA !== orderB) return orderA - orderB
                          return a.localeCompare(b)
                        })
                        .map(([majorCategory, categoryTasks]) => (
                        <div key={majorCategory} className={`border border-gray-200 rounded-lg overflow-hidden ${styles.categoryGroup}`}>
                          {/* 대분류 헤더 */}
                          <div 
                            className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer hover:bg-gray-150 transition-colors"
                            onClick={() => toggleMajor('notStarted', majorCategory)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {expandedNotStartedMajors.has(majorCategory) ? '📂' : '📁'}
                              </span>
                              <span className="font-medium text-gray-900">{majorCategory}</span>
                              <span className="text-sm text-gray-500">({categoryTasks.length}개)</span>
                            </div>
                            <span className="text-gray-400">
                              {expandedNotStartedMajors.has(majorCategory) ? '▼' : '▶'}
                            </span>
                          </div>
                          
                          {/* 대분류별 업무 목록 */}
                          {expandedNotStartedMajors.has(majorCategory) && (
                            <div className="p-3 space-y-3 bg-white">
                              {categoryTasks.map((task) => (
                                <TaskItem key={task.id} task={task} isCompleted={false} />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 완료 업무 - 대분류별 그룹핑 */}
                {Object.keys(groupedCompleted).length > 0 && (
                  <div>
                    <div className={`flex justify-between items-center mb-3 ${styles.sectionHeader}`}>
                      <h3 className="text-lg font-semibold text-gray-900">
                        ✅ 완료된 업무 ({completedTasks.length}개)
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => expandAll('completed')}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        >
                          모두 펼치기
                        </button>
                        <button
                          onClick={() => collapseAll('completed')}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                        >
                          모두 접기
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(groupedCompleted)
                        .sort(([a], [b]) => {
                          const orderA = getMajorCategoryOrder(a)
                          const orderB = getMajorCategoryOrder(b)
                          if (orderA !== orderB) return orderA - orderB
                          return a.localeCompare(b)
                        })
                        .map(([majorCategory, categoryTasks]) => (
                        <div key={majorCategory} className={`border border-gray-200 rounded-lg overflow-hidden ${styles.categoryGroup}`}>
                          {/* 대분류 헤더 */}
                          <div 
                            className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer hover:bg-gray-150 transition-colors"
                            onClick={() => toggleMajor('completed', majorCategory)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {expandedCompletedMajors.has(majorCategory) ? '📂' : '📁'}
                              </span>
                              <span className="font-medium text-gray-900">{majorCategory}</span>
                              <span className="text-sm text-gray-500">({categoryTasks.length}개)</span>
                            </div>
                            <span className="text-gray-400">
                              {expandedCompletedMajors.has(majorCategory) ? '▼' : '▶'}
                            </span>
                          </div>
                          
                          {/* 대분류별 업무 목록 */}
                          {expandedCompletedMajors.has(majorCategory) && (
                            <div className="p-3 space-y-3 bg-white">
                              {categoryTasks.map((task) => (
                                <TaskItem key={task.id} task={task} isCompleted={true} />
                              ))}
                            </div>
                          )}
                        </div>
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
          tasks={tasks}
        />
      )}
    </>
  )
}

export default ResourceTasksPopup

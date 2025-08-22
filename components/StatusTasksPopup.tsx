import React, { useState } from 'react'
import { Task } from '../types/task'
import { getMajorCategoryOrder } from '../utils/tree/builder'
import TaskDetailPopupRefactored from './gantt/TaskDetailPopupRefactored'

interface StatusTasksPopupProps {
  status: 'completed' | 'inProgress' | 'notStarted' | 'delayed'
  tasks: Task[]
  isOpen: boolean
  onClose: () => void
  onTaskUpdate?: (updatedTask: Task) => void
}

const StatusTasksPopup: React.FC<StatusTasksPopupProps> = ({
  status,
  tasks,
  isOpen,
  onClose,
  onTaskUpdate
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set())
  // 부서별 대분류 접기/펼치기 상태: key = `${department}::${major}`
  const [expandedMajors, setExpandedMajors] = useState<Set<string>>(new Set())

  if (!isOpen) return null

  // Task 상세 정보 관련 핸들러들을 컴포넌트 최상위로 이동
  const handleTaskDoubleClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  const handleTaskDetailClose = () => {
    setIsTaskDetailOpen(false)
    setSelectedTask(null)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask)
    }
    handleTaskDetailClose()
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'completed':
        return {
          title: '✅ 완료된 작업',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          hoverColor: 'hover:bg-green-100'
        }
      case 'inProgress':
        return {
          title: '🔄 진행중인 작업',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          hoverColor: 'hover:bg-blue-100'
        }
      case 'notStarted':
        return {
          title: '⏸️ 미시작 작업',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          hoverColor: 'hover:bg-gray-100'
        }
      case 'delayed':
        return {
          title: '⏰ 지연 작업',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          hoverColor: 'hover:bg-red-100'
        }
    }
  }

  const statusInfo = getStatusInfo()

  // 부서 > 대분류로 작업 그룹핑 (대분류 정렬은 Action Items 정렬 사용)
  const groupTasksByDepartment = (tasks: Task[]) => {
    const grouped = tasks.reduce((acc, task) => {
      const department = task.department || '미지정'
      if (!acc[department]) {
        acc[department] = []
      }
      acc[department].push(task)
      return acc
    }, {} as Record<string, Task[]>)

    // 부서명으로 정렬
    const sortedDepartments = Object.keys(grouped).sort((a, b) => 
      a.localeCompare(b, 'ko', { numeric: true })
    )

    return sortedDepartments.map(department => {
      const deptTasks = grouped[department]
      // 대분류별 그룹핑
      const majorMap = deptTasks.reduce((m, t) => {
        const major = t.majorCategory || '미분류'
        if (!m[major]) m[major] = []
        m[major].push(t)
        return m
      }, {} as Record<string, Task[]>)

      // 대분류 정렬 (Action Items 동일 로직) 후 배열화
      const sortedMajorKeys = Object.keys(majorMap).sort((a, b) => {
        const oa = getMajorCategoryOrder(a)
        const ob = getMajorCategoryOrder(b)
        if (oa !== ob) return oa - ob
        return a.localeCompare(b, 'ko', { numeric: true })
      })
      const majors = sortedMajorKeys.map(major => ({
        major,
        tasks: majorMap[major].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko', { numeric: true }))
      }))

      return { department, majors }
    })
  }

  const groupedTasks = groupTasksByDepartment(tasks)

  // 부서별 접기/펼치기 토글
  const toggleDepartment = (department: string) => {
    const newExpanded = new Set(expandedDepartments)
    if (newExpanded.has(department)) {
      newExpanded.delete(department)
    } else {
      newExpanded.add(department)
    }
    setExpandedDepartments(newExpanded)
  }

  // 모든 부서 펼치기/접기
  const toggleAllDepartments = () => {
    if (expandedDepartments.size === groupedTasks.length) {
      setExpandedDepartments(new Set())
    } else {
      setExpandedDepartments(new Set(groupedTasks.map(group => group.department)))
    }
  }

  const toggleMajor = (department: string, major: string) => {
    const key = `${department}::${major}`
    const next = new Set(expandedMajors)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setExpandedMajors(next)
  }

  // Task 아이템 컴포넌트
  const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
    // 카테고리 계층 구조 생성
    const hierarchy = [
      task.majorCategory,
      task.middleCategory,
      task.minorCategory,
      task.name
    ].filter(Boolean)

    return (
      <div
        className={`p-3 rounded-lg border cursor-pointer transition-all shadow-sm ${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.hoverColor}`}
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

            {/* 진행률 표시 */}
            <div className="text-sm font-medium text-gray-600">
              {task.percentComplete || 0}%
            </div>
          </div>

          {/* 담당자 및 일정 정보 */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>담당자: {task.resource || '미정'}</span>
            <span>
              {task.start && new Date(task.start).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} ~{' '}
              {task.end && new Date(task.end).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
            </span>
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
              {statusInfo.title} ({tasks.length}개)
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
              title="닫기"
            >
              ✕
            </button>
          </div>

          {/* 업무 목록 */}
          <div className="p-6 overflow-y-auto max-h-96 transform-gpu will-change-transform relative z-0">
            {tasks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                해당 상태의 작업이 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {/* 전체 펼치기/접기 버튼 */}
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">
                    총 {groupedTasks.length}개 부서, {tasks.length}개 작업
                  </span>
                  <button
                    onClick={toggleAllDepartments}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {expandedDepartments.size === groupedTasks.length ? '▲ 모두 접기' : '▼ 모두 펼치기'}
                  </button>
                </div>

                {groupedTasks.map(({ department, majors }) => {
                  const isExpanded = expandedDepartments.has(department)
                  const deptCount = majors.reduce((sum, m) => sum + m.tasks.length, 0)
                  
                  return (
                    <div key={department} className="border border-gray-200 rounded-lg">
                      {/* 부서 헤더 (클릭 가능) */}
                      <div 
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-t-lg"
                        onClick={() => toggleDepartment(department)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-800">
                            🏢 {department}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full border">
                            {deptCount}개 작업
                          </span>
                          {!isExpanded && (
                            <span className="text-xs text-gray-400">
                              클릭하여 펼치기
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* 부서별 작업 목록 (접기/펼치기) */}
                      {isExpanded && (
                        <div className="p-3 space-y-4 bg-white rounded-b-lg">
                          {majors.map(({ major, tasks: majorTasks }) => {
                            const majorKey = `${department}::${major}`
                            const isMajorExpanded = expandedMajors.has(majorKey)
                            return (
                              <div key={major} className="space-y-2 border border-gray-100 rounded-md">
                                {/* 대분류 헤더 (클릭으로 접기/펼치기) */}
                                <button
                                  type="button"
                                  className="w-full flex items-center justify-between text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-t-md"
                                  onClick={() => toggleMajor(department, major)}
                                >
                                  <span className="text-sm font-semibold text-gray-700">
                                    {isMajorExpanded ? '▼' : '▶'} {major}
                                  </span>
                                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                                    {majorTasks.length}개
                                  </span>
                                </button>
                                {isMajorExpanded && (
                                  <div className="grid gap-2 p-2 rounded-b-md">
                                    {majorTasks.map((task: Task) => (
                                      <div key={task.id} className="transform-gpu will-change-transform">
                                        <TaskItem task={task} />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="flex justify-end p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>

      {/* Task 상세 정보 팝업 - 메인 팝업보다 높은 z-index로 렌더링 */}
      {selectedTask && isTaskDetailOpen && (
        <TaskDetailPopupRefactored
          task={selectedTask}
          position={{ x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 250 }}
          onClose={handleTaskDetailClose}
          onTaskUpdate={handleTaskUpdate}
          tasks={tasks}
        />
      )}
    </>
  )
}

export default StatusTasksPopup

import { useState, useMemo } from 'react'
import { Task, ViewMode, GroupBy, DateUnit } from '../types/task'

export const useGanttChart = (tasks: Task[], viewMode: ViewMode, groupBy?: GroupBy) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [dateUnit, setDateUnit] = useState<DateUnit>('month')
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null)

  // 그룹별 작업 분류
  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {}
    
    tasks.forEach(task => {
      let groupKey = '미분류'
      
      switch (groupBy) {
        case 'resource':
          groupKey = task.resource || '미지정'
          break
        case 'action':
          groupKey = task.name || task.detail || '미지정 작업'
          break
        default:
          groupKey = task.category || '기타'
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(task)
    })
    
    return groups
  }, [tasks, groupBy])

  // 실제 표시할 작업들 (모든 보기에서 전체 작업 표시)
  const filteredTasks = useMemo(() => {
    // 담당자별, Action Item별 구분 제거로 항상 모든 작업 표시
    return tasks
  }, [tasks])

  // 차트 데이터 변환
  const chartData = useMemo(() => {
    if (!tasks || tasks.length === 0) return []

    const columns = [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ]

    let filteredTasks = tasks
    
    if (viewMode === 'overview') {
      // 전체 개요: 그룹별 대표 작업만 표시
      const groupSummaries: Task[] = []
      
      Object.entries(groupedTasks).forEach(([groupName, groupTasks]) => {
        if (groupTasks.length === 0) return
        
        // 그룹의 시작일/종료일 계산
        const startDates = groupTasks.map(t => t.start.getTime())
        const endDates = groupTasks.map(t => t.end.getTime())
        const avgProgress = groupTasks.reduce((sum, t) => sum + t.percentComplete, 0) / groupTasks.length
        
        // 그룹 유형에 따른 아이콘 선택
        const groupIcon = groupBy === 'resource' ? '👥' :
                         groupBy === 'action' ? '📋' : '📁'
        
        groupSummaries.push({
          id: `GROUP_${groupName}`,
          name: `${groupIcon} ${groupName} (${groupTasks.length}개 작업)`,
          resource: groupName,
          start: new Date(Math.min(...startDates)),
          end: new Date(Math.max(...endDates)),
          duration: null,
          percentComplete: avgProgress,
          dependencies: null,
          category: groupName
        })
      })
      
      filteredTasks = groupSummaries
    } else {
      // 세부 보기: 선택된 그룹의 작업들만 표시
      if (expandedGroups.size > 0) {
        filteredTasks = tasks.filter(task => {
          let groupKey = '미분류'
          
          switch (groupBy) {
            case 'resource':
              groupKey = task.resource || '미지정'
              break
            case 'action':
              groupKey = task.name || task.detail || '미지정 작업'
              break
            default:
              groupKey = task.category || '기타'
          }
          
          return expandedGroups.has(groupKey)
        })
      }
    }

    const rows = filteredTasks.map(task => [
      task.id,
      task.name,
      task.resource,
      task.start,
      task.end,
      null, // duration은 Google Charts가 자동 계산
      task.percentComplete,
      task.dependencies,
    ])

    return [columns, ...rows]
  }, [tasks, viewMode, groupBy, expandedGroups, groupedTasks])

  // 그룹 토글 함수
  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName)
    } else {
      newExpanded.add(groupName)
    }
    setExpandedGroups(newExpanded)
  }

  const expandAllGroups = () => {
    setExpandedGroups(new Set(Object.keys(groupedTasks)))
  }

  const collapseAllGroups = () => {
    setExpandedGroups(new Set())
  }

  const handleTaskSelect = (selection: any, position?: { x: number; y: number }) => {
    if (selection && selection.length > 0) {
      const selectedIndex = selection[0].row
      if (selectedIndex >= 0 && selectedIndex < tasks.length) {
        setSelectedTask(tasks[selectedIndex])
        setPopupPosition(position || null)
      }
    }
  }

  return {
    selectedTask,
    setSelectedTask,
    expandedGroups,
    groupedTasks,
    filteredTasks,
    chartData,
    dateUnit,
    setDateUnit,
    toggleGroup,
    expandAllGroups,
    collapseAllGroups,
    handleTaskSelect,
    popupPosition,
    setPopupPosition
  }
}

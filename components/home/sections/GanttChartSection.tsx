import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Task, ViewMode, GroupBy } from '../../../types/task'
import GanttChart from '../../GanttChart'

interface GanttChartSectionProps {
  tasks: Task[]
  onTaskUpdate?: (updatedTask: Task) => void
  onTaskAdd?: (newTask: Partial<Task>) => void
  onTaskDelete?: (taskId: string) => void
  onDataRefresh?: () => void
}

const GanttChartSection: React.FC<GanttChartSectionProps> = ({ 
  tasks, 
  onTaskUpdate, 
  onTaskAdd,
  onTaskDelete, 
  onDataRefresh 
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [groupBy, setGroupBy] = useState<GroupBy>('resource')

  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        📈 간트 차트
      </Typography>
      
      <GanttChart 
        tasks={tasks}
        viewMode={viewMode}
        groupBy={groupBy}
        onViewModeChange={setViewMode}
        onGroupByChange={setGroupBy}
        onTaskUpdate={onTaskUpdate}
        onTaskAdd={onTaskAdd}
        onTaskDelete={onTaskDelete}
        onDataRefresh={onDataRefresh}
      />
    </Box>
  )
}

export default GanttChartSection

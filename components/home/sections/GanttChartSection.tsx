import React, { useState } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { Task, ViewMode, GroupBy } from '../../../types/task'
import GanttChart from '../../GanttChart'

interface GanttChartSectionProps {
  tasks: Task[]
  onTaskUpdate?: (updatedTask: Task) => void
  onTaskAdd?: (newTask: Partial<Task>) => void
  onTaskDelete?: (taskId: string) => void
  onDataRefresh?: () => void
  onMajorCategoryUpdate?: (oldCategory: string, newCategory: string) => Promise<void>
  onSubCategoryUpdate?: (taskId: string, middleCategory: string, subCategory: string) => Promise<void>
  onMoveMajorCategory?: (currentMajorCategory: string, currentMinorCategory: string, targetMajorCategory: string) => Promise<{ success: boolean; updatedCount: number }>
}

const GanttChartSection: React.FC<GanttChartSectionProps> = ({ 
  tasks, 
  onTaskUpdate, 
  onTaskAdd,
  onTaskDelete, 
  onDataRefresh,
  onMajorCategoryUpdate,
  onSubCategoryUpdate,
  onMoveMajorCategory
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [groupBy, setGroupBy] = useState<GroupBy>('resource')

  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        📈 간트 차트
      </Typography>
      
      <Paper elevation={2} sx={{ p: 2 }}>
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
          onMajorCategoryUpdate={onMajorCategoryUpdate}
          onSubCategoryUpdate={onSubCategoryUpdate}
          onMoveMajorCategory={onMoveMajorCategory}
        />
      </Paper>
    </Box>
  )
}

export default GanttChartSection

import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { Task } from '../../../types/task'
import StatsDashboard from '../../StatsDashboard'
import { useTaskAnalytics } from '../../../hooks'

interface DashboardSectionProps {
  tasks: Task[]
  onTaskUpdate?: (updatedTask: Task) => void
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ 
  tasks,
  onTaskUpdate
}) => {
  const { stats } = useTaskAnalytics(tasks)

  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        📊 프로젝트 대시보드
      </Typography>
      
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <StatsDashboard 
          stats={stats} 
          tasks={tasks}
          onTaskUpdate={onTaskUpdate}
        />
      </Paper>

  {/* 주의가 필요한 작업들 블록 제거됨 */}
    </Box>
  )
}

export default DashboardSection

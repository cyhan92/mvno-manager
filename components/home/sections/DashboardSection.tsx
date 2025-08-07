import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import { Task } from '../../../types/task'
import StatsDashboard from '../../StatsDashboard'
import RiskAnalysisComponent from '../../RiskAnalysis'
import ResourceStatsComponent from '../../ResourceStats'
import { useTaskAnalytics } from '../../../hooks'

interface DashboardSectionProps {
  tasks: Task[]
  source: string | null
  onTaskUpdate?: (updatedTask: Task) => void
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ 
  tasks, 
  source, 
  onTaskUpdate 
}) => {
  const { stats, riskAnalysis, resourceStats } = useTaskAnalytics(tasks)

  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        📊 프로젝트 대시보드
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <StatsDashboard stats={stats} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box mb={3}>
            <RiskAnalysisComponent riskAnalysis={riskAnalysis} />
          </Box>
          <ResourceStatsComponent 
            resourceStats={resourceStats} 
            tasks={tasks}
            onTaskUpdate={onTaskUpdate}
          />
        </Grid>
      </Grid>
      
      {source && (
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            데이터 소스: {source}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default DashboardSection

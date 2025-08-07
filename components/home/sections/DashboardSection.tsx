import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { Task } from '../../../types/task'
import StatsDashboard from '../../StatsDashboard'
import RiskAnalysisComponent from '../../RiskAnalysis'
import { useTaskAnalytics } from '../../../hooks'

interface DashboardSectionProps {
  tasks: Task[]
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ 
  tasks
}) => {
  const { stats, riskAnalysis } = useTaskAnalytics(tasks)

  return (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        📊 프로젝트 대시보드
      </Typography>
      
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <StatsDashboard stats={stats} />
      </Paper>

      <Box flex={1}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <RiskAnalysisComponent riskAnalysis={riskAnalysis} />
        </Paper>
      </Box>
    </Box>
  )
}

export default DashboardSection

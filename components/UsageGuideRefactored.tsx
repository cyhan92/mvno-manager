'use client'
import React, { useState } from 'react'
import {
  Paper,
  Collapse,
  Box,
  Stack
} from '@mui/material'

// 분리된 섹션 컴포넌트들
import GuideHeader from './guide/GuideHeader'
import SystemOverviewSection from './guide/sections/SystemOverviewSection'
import ExcelUploadGuideSection from './guide/sections/ExcelUploadGuideSection'
import GanttChartGuideSection from './guide/sections/GanttChartGuideSection'
import TaskEditGuideSection from './guide/sections/TaskEditGuideSection'
import ActionItemsGuideSection from './guide/sections/ActionItemsGuideSection'
import ResourceStatsGuideSection from './guide/sections/ResourceStatsGuideSection'
import TroubleshootingSection from './guide/sections/TroubleshootingSection'

const UsageGuideRefactored: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      <GuideHeader 
        isExpanded={isExpanded} 
        onToggleExpanded={handleToggleExpanded} 
      />

      <Collapse in={isExpanded}>
        <Box sx={{ p: 3 }}>
          <Stack spacing={4}>
            <SystemOverviewSection />
            <ExcelUploadGuideSection />
            <GanttChartGuideSection />
            <TaskEditGuideSection />
            <ActionItemsGuideSection />
            <ResourceStatsGuideSection />
            <TroubleshootingSection />
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default UsageGuideRefactored
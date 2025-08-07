'use client'
import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Button,
  Collapse,
  Box,
  Grid
} from '@mui/material'
import {
  MenuBook as MenuBookIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material'
import FeatureCardComponent from './guide/sections/FeatureCardComponent'
import QuickStartSection from './guide/sections/QuickStartSection'
import HelpTipsSection from './guide/sections/HelpTipsSection'
import { featureCardsData } from './guide/sections/featureCardsData'

const UsageGuideModular: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <MenuBookIcon fontSize="large" />
            <Typography variant="h5" component="h2" fontWeight={600}>
              사용 가이드
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => setIsExpanded(!isExpanded)}
            endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {isExpanded ? '간단히 보기' : '자세히 보기'}
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* 기능 카드들 */}
        <Typography variant="h6" gutterBottom fontWeight={600}>
          🚀 주요 기능
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {featureCardsData.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <FeatureCardComponent feature={feature} />
            </Grid>
          ))}
        </Grid>

        {/* 확장 가능한 상세 내용 */}
        <Collapse in={isExpanded}>
          <QuickStartSection />
          <HelpTipsSection />
        </Collapse>
      </Box>
    </Paper>
  )
}

export default UsageGuideModular

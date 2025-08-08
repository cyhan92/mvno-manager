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
      {/* Header - 항상 보이는 부분 */}
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'primary.dark'
          }
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <MenuBookIcon />
            <Typography variant="h6" component="h2" fontWeight={600}>
              📖 사용 가이드 (v2.2 업데이트) - Action Item 관리 기능 개선 및 시스템 활용법 확인
            </Typography>
          </Box>
          <Button
            variant="text"
            endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ 
              color: 'white',
              minWidth: 'auto',
              '&:hover': {
                bgcolor: 'transparent'
              }
            }}
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? '접기' : '펼치기'}
          </Button>
        </Box>
      </Box>

      {/* 확장 가능한 상세 내용 */}
      <Collapse in={isExpanded}>
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

          <QuickStartSection />
          <HelpTipsSection />
        </Box>
      </Collapse>
    </Paper>
  )
}

export default UsageGuideModular

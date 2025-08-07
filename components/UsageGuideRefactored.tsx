'use client'
import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Button,
  Collapse,
  Box,
  Alert,
  AlertTitle,
  Divider
} from '@mui/material'
import {
  MenuBook as MenuBookIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material'

import { FeatureCardComponent } from './guide/FeatureCard'
import { QuickStartStepComponent } from './guide/QuickStartStep'
import { FeatureDetailComponent } from './guide/FeatureDetail'
import { TipComponent } from './guide/TipComponent'
import { 
  featureCardsData, 
  quickStartStepsData, 
  featureDetailsData, 
  tipsData 
} from './guide/GuideDataTypes'

const UsageGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      {/* 헤더 */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          p: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuBookIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                MVNO Manager 사용 가이드
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mt: 0.5 }}>
                프로젝트 관리 시스템 완벽 활용법
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleToggle}
            startIcon={<PlayArrowIcon />}
            sx={{ 
              minWidth: 140,
              bgcolor: 'rgba(255,255,255,0.2)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
            }}
          >
            시작하기
          </Button>
        </Box>
      </Box>

      {/* 주요 기능 카드 */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          🚀 주요 기능
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          },
          gap: 3,
          mb: 4 
        }}>
          {featureCardsData.map((feature, index) => (
            <FeatureCardComponent key={index} feature={feature} />
          ))}
        </Box>

        {/* 빠른 시작 가이드 */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>💡 빠른 시작</AlertTitle>
          아래 단계를 따라하면 5분 내에 프로젝트 관리를 시작할 수 있습니다!
        </Alert>

        <Button
          onClick={handleToggle}
          variant="outlined"
          size="large"
          fullWidth
          endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mb: 3, py: 1.5 }}
        >
          {isExpanded ? '가이드 접기' : '상세 가이드 보기'}
        </Button>

        <Collapse in={isExpanded}>
          <Box sx={{ mt: 3 }}>
            {/* Quick Start Steps */}
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'success.main' }}>
              📋 빠른 시작 가이드
            </Typography>
            {quickStartStepsData.map((step, index) => (
              <QuickStartStepComponent key={index} step={step} index={index} />
            ))}

            <Divider sx={{ my: 4 }} />

            {/* 상세 기능 설명 */}
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'warning.main' }}>
              🔧 상세 기능 설명
            </Typography>
            {featureDetailsData.map((featureDetail, index) => (
              <FeatureDetailComponent key={index} featureDetail={featureDetail} />
            ))}

            <Divider sx={{ my: 4 }} />

            {/* 활용 팁 */}
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'info.main' }}>
              💡 활용 팁
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                md: 'repeat(3, 1fr)' 
              },
              gap: 3 
            }}>
              {tipsData.map((tip, index) => (
                <TipComponent key={index} tip={tip} />
              ))}
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  )
}

export default UsageGuide

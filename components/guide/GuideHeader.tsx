import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import {
  MenuBook as MenuBookIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material'

interface GuideHeaderProps {
  isExpanded: boolean
  onToggleExpanded: () => void
}

const GuideHeader: React.FC<GuideHeaderProps> = ({ isExpanded, onToggleExpanded }) => {
  return (
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
          onClick={onToggleExpanded}
          endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ 
            color: 'white', 
            borderColor: 'rgba(255,255,255,0.5)',
            '&:hover': { 
              borderColor: 'white',
              bgcolor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          {isExpanded ? '접기' : '펼치기'}
        </Button>
      </Box>
    </Box>
  )
}

export default GuideHeader

import React from 'react'
import { Card, CardContent, Typography, Box, Chip } from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  TableChart as TableChartIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material'

interface FeatureCardData {
  iconName: string
  title: string
  description: string
  color: 'primary' | 'success' | 'info' | 'warning' | 'secondary' | 'error'
}

interface FeatureCardProps {
  feature: FeatureCardData
}

const getIcon = (iconName: string, color: string) => {
  const iconProps = { color: color as any }
  
  switch (iconName) {
    case 'CloudUpload':
      return <CloudUploadIcon {...iconProps} />
    case 'TableChart':
      return <TableChartIcon {...iconProps} />
    case 'Assignment':
      return <AssignmentIcon {...iconProps} />
    case 'Edit':
      return <EditIcon {...iconProps} />
    case 'People':
      return <PeopleIcon {...iconProps} />
    case 'TrendingUp':
      return <TrendingUpIcon {...iconProps} />
    default:
      return <CloudUploadIcon {...iconProps} />
  }
}

const FeatureCardComponent: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <Card elevation={1} sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          {getIcon(feature.iconName, feature.color)}
          <Typography variant="h6" component="h3" fontWeight={600}>
            {feature.title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {feature.description}
        </Typography>
        <Chip 
          label={feature.title} 
          color={feature.color} 
          size="small" 
          variant="outlined" 
        />
      </CardContent>
    </Card>
  )
}

export default FeatureCardComponent

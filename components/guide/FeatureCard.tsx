import React from 'react'
import { Card, CardContent, Chip, Typography, Box } from '@mui/material'
import { getIcon } from './IconUtils'
import { FeatureCard } from './GuideDataTypes'

interface FeatureCardComponentProps {
  feature: FeatureCard
}

export const FeatureCardComponent: React.FC<FeatureCardComponentProps> = ({ feature }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ mb: 2 }}>
          {getIcon(feature.iconType, feature.color)}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom>
          {feature.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {feature.description}
        </Typography>
        <Chip 
          label={feature.color.toUpperCase()} 
          color={feature.color} 
          size="small" 
          variant="outlined"
        />
      </CardContent>
    </Card>
  )
}

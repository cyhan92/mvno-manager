import React from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  Stack,
  Box
} from '@mui/material'
import { getIcon } from './IconUtils'
import { FeatureDetail } from './GuideDataTypes'

interface FeatureDetailComponentProps {
  featureDetail: FeatureDetail
}

export const FeatureDetailComponent: React.FC<FeatureDetailComponentProps> = ({ featureDetail }) => {
  const colors = ['primary', 'success', 'warning'] as const

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {getIcon(featureDetail.iconType, 'primary')}
          <Typography variant="h5" sx={{ ml: 2 }}>
            {featureDetail.category}
          </Typography>
        </Box>

        {featureDetail.features.map((feature, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {feature.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {feature.description}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                주요 장점:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {feature.benefits.map((benefit, idx) => (
                  <Chip 
                    key={idx} 
                    label={benefit} 
                    size="small" 
                    color={colors[idx % colors.length]}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

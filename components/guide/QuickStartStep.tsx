import React from 'react'
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Card, 
  CardContent,
  Chip,
  Stack,
  Box
} from '@mui/material'
import { getIcon } from './IconUtils'
import { QuickStartStep } from './GuideDataTypes'

interface QuickStartStepComponentProps {
  step: QuickStartStep
  index: number
}

export const QuickStartStepComponent: React.FC<QuickStartStepComponentProps> = ({ step, index }) => {
  const colors = ['primary', 'success', 'info', 'warning'] as const
  const color = colors[index % colors.length]

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getIcon(step.iconType, color)}
          <Typography variant="h6" sx={{ ml: 2 }}>
            {step.title}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {step.description}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {step.details.map((detail, idx) => (
            <Chip 
              key={idx} 
              label={detail} 
              variant="outlined" 
              size="small"
              color={color}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

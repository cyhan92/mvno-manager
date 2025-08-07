import React from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box
} from '@mui/material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { getIcon } from './IconUtils'
import { Tip } from './GuideDataTypes'

interface TipComponentProps {
  tip: Tip
}

export const TipComponent: React.FC<TipComponentProps> = ({ tip }) => {
  const colors = ['primary', 'success', 'info'] as const
  const colorIndex = Math.floor(Math.random() * colors.length)
  const color = colors[colorIndex]

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getIcon(tip.iconType, color)}
          <Typography variant="h6" sx={{ ml: 2 }}>
            {tip.title}
          </Typography>
        </Box>
        <List dense>
          {tip.content.map((item, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleIcon color={color} fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={item}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

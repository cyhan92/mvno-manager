import React from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle
} from '@mui/material'
import {
  Lightbulb as LightbulbIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

const HelpTipsSection: React.FC = () => {
  const tips = [
    {
      icon: <CheckCircleIcon color="success" />,
      text: 'Excel 파일은 특정 형식을 따라야 합니다. 샘플 파일을 참고하세요.'
    },
    {
      icon: <InfoIcon color="info" />,
      text: 'Gantt 차트에서 작업을 더블클릭하면 상세 정보를 확인할 수 있습니다.'
    },
    {
      icon: <WarningIcon color="warning" />,
      text: '작업 편집 시 데이터베이스에 실시간으로 반영됩니다.'
    },
    {
      icon: <LightbulbIcon color="primary" />,
      text: '담당자별 현황에서 담당자 이름을 더블클릭하면 해당 담당자의 모든 업무를 볼 수 있습니다.'
    }
  ]

  return (
    <Box mb={4}>
      <Alert severity="success" sx={{ mb: 3 }}>
        <AlertTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <LightbulbIcon />
            도움말 및 팁
          </Box>
        </AlertTitle>
        <Typography variant="body2">
          더 효과적인 사용을 위한 팁들입니다.
        </Typography>
      </Alert>

      <List sx={{ bgcolor: 'success.50', borderRadius: 2, p: 2 }}>
        {tips.map((tip, index) => (
          <ListItem key={index} sx={{ mb: 1 }}>
            <ListItemIcon>{tip.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2">
                  {tip.text}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default HelpTipsSection

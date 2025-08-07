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
  PlayArrow as PlayArrowIcon,
  CloudUpload as CloudUploadIcon,
  TableChart as TableChartIcon,
  Edit as EditIcon,
  People as PeopleIcon
} from '@mui/icons-material'

const QuickStartSection: React.FC = () => {
  const quickStartSteps = [
    {
      icon: <CloudUploadIcon color="primary" />,
      primary: 'Excel 파일 업로드',
      secondary: 'DatabaseSync 컴포넌트에서 Excel 파일을 선택하여 업로드'
    },
    {
      icon: <TableChartIcon color="success" />,
      primary: 'Gantt 차트 확인',
      secondary: '업로드된 데이터가 Gantt 차트로 자동 변환되어 표시'
    },
    {
      icon: <EditIcon color="warning" />,
      primary: '작업 편집',
      secondary: 'Gantt 차트에서 작업을 클릭하여 상세 정보 편집'
    },
    {
      icon: <PeopleIcon color="info" />,
      primary: '담당자별 현황 확인',
      secondary: '담당자별 업무 현황을 확인하고 세부 업무 관리'
    }
  ]

  return (
    <Box mb={4}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PlayArrowIcon />
            빠른 시작
          </Box>
        </AlertTitle>
        <Typography variant="body2">
          아래 단계를 따라하면 쉽게 시작할 수 있습니다.
        </Typography>
      </Alert>

      <List sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
        {quickStartSteps.map((step, index) => (
          <ListItem key={index} sx={{ mb: 1 }}>
            <ListItemIcon>{step.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="subtitle2" fontWeight={600}>
                  {index + 1}. {step.primary}
                </Typography>
              }
              secondary={step.secondary}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default QuickStartSection

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
      primary: '작업 편집 및 Action Item 관리',
      secondary: 'Gantt 차트에서 작업을 클릭하여 편집하거나 우클릭으로 Action Item 관리 (v2.2 신규)'
    },
    {
      icon: <PlayArrowIcon color="secondary" />,
      primary: 'Action Item 추가/수정/삭제',
      secondary: '업무 행에서 우클릭 → 상세업무 메뉴로 세부 항목 관리 (즉시 반영, v2.2 신규)'
    },
    {
      icon: <PeopleIcon color="info" />,
      primary: '담당자별 현황 확인 (v2.3 대폭 개선)',
      secondary: '담당자 더블클릭 → 상태별 3단계 섹션(미시작/진행중/완료) → 대분류 그룹핑/펼치기/접기'
    }
  ]

  return (
    <Box mb={4}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <AlertTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PlayArrowIcon />
            빠른 시작 (v2.3 업데이트)
          </Box>
        </AlertTitle>
        <Typography variant="body2">
          아래 단계를 따라하면 쉽게 시작할 수 있습니다. v2.3에서 담당자 업무창 UX가 대폭 개선되었습니다.
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

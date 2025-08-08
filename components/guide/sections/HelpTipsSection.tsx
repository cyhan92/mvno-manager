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
      icon: <InfoIcon color="info" />,
      text: '업무 행에서 우클릭하면 Action Item(상세업무) 추가/편집 메뉴가 나타납니다. (v2.2 신규)'
    },
    {
      icon: <LightbulbIcon color="primary" />,
      text: 'Action Item 추가 시 담당자/부서가 비어있으면 자동으로 "미정"으로 설정됩니다. (v2.2 신규)'
    },
    {
      icon: <CheckCircleIcon color="success" />,
      text: 'Action Item 추가/수정/삭제 시 페이지 새로고침 없이 즉시 화면에 반영됩니다. (v2.2 신규)'
    },
    {
      icon: <InfoIcon color="info" />,
      text: '소분류에서 우클릭하면 중분류나 소분류를 추가할 수 있습니다.'
    },
    {
      icon: <WarningIcon color="warning" />,
      text: '작업 편집 시 데이터베이스에 실시간으로 반영됩니다.'
    },
    {
      icon: <LightbulbIcon color="primary" />,
      text: '담당자별 현황에서 담당자 이름을 더블클릭하면 해당 담당자의 모든 업무를 볼 수 있습니다.'
    },
    {
      icon: <InfoIcon color="info" />,
      text: '대시보드의 완료/진행중/미시작 박스를 더블클릭하면 해당 상태의 작업 목록을 볼 수 있습니다.'
    },
    {
      icon: <LightbulbIcon color="primary" />,
      text: '팝업에서 표시된 세부 업무를 더블클릭하면 작업 상세 정보를 편집할 수 있습니다.'
    },
    {
      icon: <CheckCircleIcon color="success" />,
      text: '여러 Action Item을 관리할 때는 "상세업무 편집" 메뉴로 한 번에 관리하는 것이 효율적입니다. (v2.2 팁)'
    }
  ]

  return (
    <Box mb={4}>
      <Alert severity="success" sx={{ mb: 3 }}>
        <AlertTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <LightbulbIcon />
            도움말 및 팁 (v2.2 업데이트)
          </Box>
        </AlertTitle>
        <Typography variant="body2">
          더 효과적인 사용을 위한 팁들입니다. v2.2의 새로운 Action Item 관리 기능을 포함합니다.
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

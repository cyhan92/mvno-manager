import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Chip,
  Alert
} from '@mui/material'
import {
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material'

const TaskEditGuideSection: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <EditIcon color="warning" />
          <Typography variant="h6" color="warning.main" fontWeight={600}>
            작업 편집 가이드
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon color="warning" fontSize="small" />
            <Typography>작업 더블클릭 시 상세 정보 편집 팝업 열림</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon color="warning" fontSize="small" />
            <Typography>작업명, 시작일, 종료일, 진행률, 담당자 등 편집 가능</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon color="warning" fontSize="small" />
            <Typography>카테고리는 &quot;대분류 &gt; 중분류 &gt; 소분류&quot; 형태로 계층적 표시</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon color="warning" fontSize="small" />
            <Box display="flex" alignItems="center" gap={1}>
              <Chip label="💾 저장" color="primary" size="small" />
              <Typography component="span">버튼 클릭하여 데이터베이스에 반영</Typography>
            </Box>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              💡 변경 사항은 즉시 Gantt 차트와 통계에 반영됩니다.
            </Typography>
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default TaskEditGuideSection

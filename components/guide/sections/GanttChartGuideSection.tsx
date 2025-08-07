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
import { TableChart as TableChartIcon } from '@mui/icons-material'

const GanttChartGuideSection: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <TableChartIcon color="success" />
          <Typography variant="h6" color="success.main" fontWeight={600}>
            Gantt 차트 활용법
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="📅" size="small" />
            <Typography>월별/주별 보기 전환: 상단 컨트롤 패널에서 날짜 단위 선택</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="🎯" size="small" />
            <Typography>담당자 정보 표시: 토글 버튼으로 담당자 정보 On/Off 가능</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="🖱️" size="small" />
            <Typography>작업 선택: Gantt 바 클릭 시 해당 작업 선택</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="✏️" size="small" />
            <Typography>작업 편집: 작업 더블클릭 시 상세 정보 팝업</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="📊" size="small" />
            <Typography>진행률 표시: 바 색상과 퍼센트로 진행 상태 확인</Typography>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              💡 Gantt 차트와 Action Items는 스크롤이 자동으로 동기화됩니다.
            </Typography>
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default GanttChartGuideSection

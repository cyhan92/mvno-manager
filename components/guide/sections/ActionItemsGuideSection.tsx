import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack
} from '@mui/material'
import {
  Assignment as AssignmentIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material'

const ActionItemsGuideSection: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ bgcolor: 'cyan.50', border: '1px solid', borderColor: 'cyan.200' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <AssignmentIcon sx={{ color: 'cyan.700' }} />
          <Typography variant="h6" sx={{ color: 'cyan.700' }} fontWeight={600}>
            Action Items 사용법
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography>트리 확장/축소: 그룹 항목 클릭 시 하위 항목 표시/숨김</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography>작업 선택: 개별 작업 클릭 시 해당 작업 선택</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography>작업 상세보기: 작업 더블클릭 시 상세 정보 팝업</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography>스크롤 동기화: Action Items와 Gantt 차트 스크롤 자동 동기화</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ActionItemsGuideSection

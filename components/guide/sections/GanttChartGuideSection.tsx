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
            Gantt 차트 활용법 (v2.2 업데이트)
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: 'success.800', fontWeight: 'bold', mb: 1 }}>
            📊 기본 기능
          </Typography>
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

          <Typography variant="body2" sx={{ color: 'success.800', fontWeight: 'bold', mb: 1, mt: 2 }}>
            🚀 v2.2 새로운 기능
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="🖱️" size="small" color="secondary" />
            <Typography><strong>우클릭 컨텍스트 메뉴:</strong> 업무 행에서 우클릭으로 Action Item 관리 메뉴 표시</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="⚡" size="small" color="secondary" />
            <Typography><strong>부분 리프레시:</strong> Action Item 변경 시 전체 페이지 새로고침 없이 즉시 반영</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="🔄" size="small" color="secondary" />
            <Typography><strong>스마트 동기화:</strong> 불필요한 데이터 덮어쓰기 방지로 사용자 경험 향상</Typography>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              💡 Gantt 차트와 Action Items는 스크롤이 자동으로 동기화됩니다.
            </Typography>
          </Alert>

          <Alert severity="success" sx={{ mt: 1 }}>
            <Typography variant="body2">
              🎯 <strong>v2.2 핵심 개선:</strong> 우클릭 메뉴를 통한 직관적인 Action Item 관리와 실시간 UI 업데이트를 지원합니다.
            </Typography>
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default GanttChartGuideSection

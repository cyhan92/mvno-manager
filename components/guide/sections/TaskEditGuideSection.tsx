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
            작업 편집 & Action Item 관리 (v2.2 업데이트)
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: 'warning.800', fontWeight: 'bold', mb: 1 }}>
            📝 기본 작업 편집
          </Typography>
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

          <Typography variant="body2" sx={{ color: 'warning.800', fontWeight: 'bold', mb: 1, mt: 2 }}>
            🚀 새로운 Action Item 관리 (v2.2)
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon color="warning" fontSize="small" />
            <Typography><strong>우클릭 메뉴:</strong> 업무 행에서 우클릭 → "상세업무 추가/편집" 선택</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon color="warning" fontSize="small" />
            <Typography><strong>즉시 반영:</strong> Action Item 추가/수정/삭제 시 페이지 새로고침 없이 바로 화면 업데이트</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon color="warning" fontSize="small" />
            <Typography><strong>자동 설정:</strong> 담당자/부서 미입력 시 "미정"으로 자동 설정</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon color="warning" fontSize="small" />
            <Typography><strong>스마트 동기화:</strong> 다른 사용자와의 충돌 없이 데이터 동기화</Typography>
          </Box>

          <Typography variant="body2" sx={{ color: 'warning.800', fontWeight: 'bold', mb: 1, mt: 2 }}>
            💾 저장 및 반영
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon color="warning" fontSize="small" />
            <Box display="flex" alignItems="center" gap={1}>
              <Chip label="💾 저장" color="primary" size="small" />
              <Typography component="span">버튼 클릭하여 데이터베이스에 반영</Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon color="warning" fontSize="small" />
            <Typography>변경사항은 실시간으로 로컬 상태에 반영되어 사용자 경험 향상</Typography>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              💡 <strong>v2.2의 핵심 개선:</strong> 모든 편집 작업이 부분 리프레시로 처리되어 더욱 빠르고 부드러운 사용자 경험을 제공합니다.
            </Typography>
          </Alert>

          <Alert severity="success" sx={{ mt: 1 }}>
            <Typography variant="body2">
              🎯 <strong>효율적 사용 팁:</strong> 여러 Action Item을 관리할 때는 "상세업무 편집" 메뉴를 활용하여 한 번에 여러 항목을 확인하고 수정하세요.
            </Typography>
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default TaskEditGuideSection

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
            Action Items 관리 (v2.2 업데이트)
          </Typography>
        </Box>
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ color: 'cyan.800', fontWeight: 'bold', mb: 1 }}>
            📝 Action Item이란?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, pl: 1 }}>
            각 업무를 구성하는 세부적인 실행 항목입니다. 예: "요구사항 분석" 업무 안의 "고객 인터뷰", "시장 조사" 등
          </Typography>

          <Typography variant="body2" sx={{ color: 'cyan.800', fontWeight: 'bold', mb: 1 }}>
            🎯 기본 조작법
          </Typography>
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

          <Typography variant="body2" sx={{ color: 'cyan.800', fontWeight: 'bold', mb: 1, mt: 2 }}>
            🚀 새로운 기능 (v2.2)
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography><strong>우클릭 컨텍스트 메뉴:</strong> 업무 행을 우클릭하면 상세업무 추가/편집 메뉴 표시</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography><strong>부분 리프레시:</strong> 추가/수정/삭제 시 전체 페이지 새로고침 없이 즉시 반영</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography><strong>자동 기본값:</strong> 담당자/부서가 비어있으면 자동으로 "미정"으로 설정</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography><strong>스마트 동기화:</strong> 다른 사용자 변경사항과 충돌 방지</Typography>
          </Box>

          <Typography variant="body2" sx={{ color: 'cyan.800', fontWeight: 'bold', mb: 1, mt: 2 }}>
            📋 Action Item 관리 방법
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography><strong>추가:</strong> 업무 행 우클릭 → "상세업무 추가" 선택</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography><strong>수정:</strong> 업무 행 우클릭 → "상세업무 편집" → 항목 클릭 → 수정 후 저장</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography><strong>삭제:</strong> 상세업무 편집 팝업에서 삭제 버튼(🗑️) 클릭</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <PlayArrowIcon sx={{ color: 'cyan.600' }} fontSize="small" />
            <Typography><strong>조회:</strong> 업무 더블클릭으로 빠른 조회, 우클릭 편집으로 상세 관리</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ActionItemsGuideSection

import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

const ResourceStatsGuideSection: React.FC = () => {
  return (
    <>
      {/* 담당자별 현황 */}
      <Card variant="outlined" sx={{ bgcolor: 'orange.50', border: '1px solid', borderColor: 'orange.200' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <PeopleIcon sx={{ color: 'orange.700' }} />
            <Typography variant="h6" sx={{ color: 'orange.700' }} fontWeight={600}>
              담당자별 현황 (v2.3 업데이트)
            </Typography>
          </Box>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
              <Typography>담당자별 업무 현황 목록을 오름차순으로 확인</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
              <Typography><strong>담당자 더블클릭 시 상태별 3단계 섹션으로 분리된 업무창</strong> (v2.3 신규)</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
              <Typography>🛌 미시작(0%) / ⏳ 진행중(1~99%) / ✅ 완료(≥100%) 섹션 자동 분류</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
              <Typography><strong>각 섹션 대분류 그룹핑 + 펼치기/접기 + "모두 펼치기/접기"</strong> (v2.3 신규)</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
              <Typography>대분류 정렬: Action Item과 동일 기준 (B→A→S→D→C→O 순서)</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
              <Typography>상태 배지/진행률 바 색상 일관화 (미시작:회색, 진행중:노랑, 완료:초록)</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* 통계 대시보드 */}
      <Card variant="outlined" sx={{ bgcolor: 'red.50', border: '1px solid', borderColor: 'red.200' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <TrendingUpIcon color="error" />
            <Typography variant="h6" color="error.main" fontWeight={600}>
              통계 대시보드 (v2.3 안정화)
            </Typography>
          </Box>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
              <ListItemText primary="전체 프로젝트 진행률 및 완료/진행중/미시작 작업 수 표시" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
              <ListItemText primary="상태별 박스 더블클릭 시 해당 상태의 세부 작업 목록 팝업" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
              <ListItemText primary="세부 작업 더블클릭 시 작업 상세 정보 편집 가능" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
              <ListItemText primary="스크롤/레이어 안정화로 겹침 현상 해결 (v2.3 개선)" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
              <ListItemText primary="진행률 바 글리치 개선 및 GPU 컴포지팅 최적화 (v2.3 개선)" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
              <ListItemText primary="부서별 업무 분포 및 담당자별 업무 현황" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
              <ListItemText primary="월별 일정 현황 및 카테고리별 진행 상황" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
              <ListItemText primary="실시간 데이터 업데이트 및 시각적 차트 제공" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </>
  )
}

export default ResourceStatsGuideSection

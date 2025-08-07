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
              담당자별 현황
            </Typography>
          </Box>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
              <Typography>담당자별 업무 현황 목록 확인</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
              <Typography>담당자 더블클릭 시 해당 담당자의 세부 업무 목록 팝업</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
              <Typography>세부 업무 더블클릭 시 작업 상세 정보 편집 가능</Typography>
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
              통계 대시보드
            </Typography>
          </Box>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
              <ListItemText primary="전체 프로젝트 진행률 및 완료/진행중/미완료 작업 수 표시" />
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

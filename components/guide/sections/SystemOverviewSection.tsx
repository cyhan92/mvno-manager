import React from 'react'
import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

const SystemOverviewSection: React.FC = () => {
  return (
    <Card variant="outlined" sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <InfoIcon color="info" />
          <Typography variant="h6" color="info.main" fontWeight={600}>
            시스템 개요
          </Typography>
        </Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'info.dark' }}>
          MVNO Manager v2.3 - 통합 프로젝트 관리 시스템
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary="Excel 파일을 업로드하여 프로젝트 작업을 관리하는 웹 기반 시스템" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary="Canvas 기반 고성능 Gantt 차트를 통한 시각적 프로젝트 일정 관리 (월별/주별 전환 가능)" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary="계층적 Action Items의 트리 구조 관리 및 단계별 확장/축소 제어" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary="우클릭 컨텍스트 메뉴를 통한 중분류/소분류 추가 기능" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary="담당자 업무창 상태별 3단계 섹션 분리 (미시작/진행중/완료) - v2.3 신규" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary="각 섹션 대분류 그룹핑 + 펼치기/접기 + 모두 펼치기/접기 - v2.3 신규" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary="대분류 정렬 기준 통일 (Action Item과 동일: B→A→S→D→C→O) - v2.3 개선" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary="상태 배지/진행률 바 색상 일관화 및 스크롤 안정화 - v2.3 개선" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary="작업 상세 정보 편집 및 실시간 업데이트" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
            <ListItemText primary="통계 대시보드를 통한 프로젝트 진행 현황 파악" />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )
}

export default SystemOverviewSection

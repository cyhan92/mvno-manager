'use client'
import React, { useState } from 'react'
import {
  Paper,
  Typography,
  Button,
  Collapse,
  Box,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid
} from '@mui/material'
import {
  MenuBook as MenuBookIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CloudUpload as CloudUploadIcon,
  TableChart as TableChartIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Storage as StorageIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayArrowIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material'

const UsageGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const featureCards = [
    {
      icon: <CloudUploadIcon color="primary" />,
      title: 'Excel → DB',
      description: 'Excel 파일을 업로드하여 데이터베이스에 저장',
      color: 'primary'
    },
    {
      icon: <TableChartIcon color="success" />,
      title: 'Gantt 차트',
      description: '월별/주별 보기, 트리 확장/축소 제어',
      color: 'success'
    },
    {
      icon: <AssignmentIcon color="info" />,
      title: 'Action Items',
      description: '작업 목록 트리 구조 및 단계별 확장/축소',
      color: 'info'
    },
    {
      icon: <EditIcon color="warning" />,
      title: '작업 편집',
      description: '작업 상세 정보 및 부서 정보 편집',
      color: 'warning'
    },
    {
      icon: <PeopleIcon color="secondary" />,
      title: '담당자별 현황',
      description: '담당자별 업무 현황 및 세부 업무 더블클릭',
      color: 'secondary'
    },
    {
      icon: <TrendingUpIcon color="error" />,
      title: '통계 대시보드',
      description: '프로젝트 진행률, 진행률 외부 표시 개선',
      color: 'error'
    }
  ]

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <MenuBookIcon fontSize="large" />
            <Typography variant="h5" component="h2" fontWeight={600}>
              사용 가이드
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => setIsExpanded(!isExpanded)}
            endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': { 
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            {isExpanded ? '접기' : '펼치기'}
          </Button>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ p: 3 }}>
          <Stack spacing={4}>
            {/* 시스템 개요 */}
            <Card variant="outlined" sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <InfoIcon color="info" />
                  <Typography variant="h6" color="info.main" fontWeight={600}>
                    시스템 개요
                  </Typography>
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'info.dark' }}>
                  스노우모바일 MVNO 프로젝트 관리 시스템
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Excel 파일을 업로드하여 프로젝트 작업을 관리하는 웹 기반 시스템" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Gantt 차트를 통한 시각적 프로젝트 일정 관리 (월별/주별 전환 가능)" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="트리 구조 Action Items의 단계별 확장/축소 제어" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="담당자별 업무 현황 및 세부 업무 상세보기" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="작업 상세 정보 편집 및 실시간 업데이트" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="간트 바 진행률 표시 개선 (바 외부 진행률 표시)" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* 주요 기능 */}
            <Card variant="outlined" sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <TrendingUpIcon color="success" />
                  <Typography variant="h6" color="success.main" fontWeight={600}>
                    주요 기능
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {featureCards.map((feature, index) => (
                    <Card 
                      key={index}
                      variant="outlined" 
                      sx={{ 
                        minWidth: 200,
                        flex: '1 1 300px',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Box mb={1}>{feature.icon}</Box>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Excel 파일 업로드 가이드 */}
            <Card variant="outlined" sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <CloudUploadIcon color="primary" />
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    Excel 파일 업로드 가이드
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip label="1" color="primary" size="small" />
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography component="span">상단의</Typography>
                      <Chip label="📁 Excel → DB" color="success" size="small" />
                      <Typography component="span">버튼 클릭</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip label="2" color="primary" size="small" />
                    <Typography>파일 선택 다이얼로그에서 Excel 파일(.xlsx, .xls) 선택</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip label="3" color="primary" size="small" />
                    <Typography>경고 메시지 확인 후 "확인" 클릭</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip label="4" color="primary" size="small" />
                    <Typography>업로드 완료 후 자동으로 페이지 새로고침</Typography>
                  </Box>
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <AlertTitle>주의사항</AlertTitle>
                    기존 데이터베이스의 모든 데이터가 삭제되고 Excel 데이터로 교체됩니다!
                  </Alert>
                </Stack>
              </CardContent>
            </Card>

            {/* Gantt 차트 활용법 */}
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
                    <Chip label="🌳" size="small" />
                    <Typography>트리 확장/축소: 전체 축소 → 1단계 확장 → 전체 확장 단계별 제어</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip label="📊" size="small" />
                    <Typography>진행률 표시: 바가 작을 때 외부에 (진행률%) 형태로 표시</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Chip label="✅" size="small" />
                    <Typography>완료 표시: 100% 완료 시 "100% - 완료" 형식 및 진한 녹색 표시</Typography>
                  </Box>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      💡 간트 바를 클릭하면 해당 작업의 상세 정보를 확인하고 편집할 수 있습니다.
                    </Typography>
                  </Alert>
                </Stack>
              </CardContent>
            </Card>

            {/* 작업 편집 가이드 */}
            <Card variant="outlined" sx={{ bgcolor: 'secondary.50', border: '1px solid', borderColor: 'secondary.200' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <EditIcon color="secondary" />
                  <Typography variant="h6" color="secondary.main" fontWeight={600}>
                    작업 편집 방법
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PlayArrowIcon color="secondary" fontSize="small" />
                    <Typography>Gantt 차트에서 작업 바를 클릭하여 상세 정보 팝업 열기</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PlayArrowIcon color="secondary" fontSize="small" />
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography component="span">팝업에서</Typography>
                      <Chip label="✏️ 편집" color="info" size="small" />
                      <Typography component="span">버튼 클릭</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PlayArrowIcon color="secondary" fontSize="small" />
                    <Typography>시작일, 종료일, 진행률, 담당자, 부서 정보 수정 가능</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PlayArrowIcon color="secondary" fontSize="small" />
                    <Typography>카테고리는 &quot;대분류 &gt; 중분류 &gt; 소분류&quot; 형태로 계층적 표시</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PlayArrowIcon color="secondary" fontSize="small" />
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

            {/* Action Items 사용법 */}
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
                    <Typography>담당자 카드 더블클릭: 해당 담당자의 세부 업무 목록 팝업 표시</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
                    <Typography>업무 분류: 대분류 &gt; 소분류 &gt; 세부업무 계층 구조</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
                    <Typography>완료 상태: ✅ 완료 (100%) / ⏳ 진행중 (100% 미만)</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <PlayArrowIcon sx={{ color: 'orange.600' }} fontSize="small" />
                    <Typography>진행률 표시: 각 업무별 진행률 시각적 표시</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* 주의사항 및 팁 */}
            <Card variant="outlined" sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <LightbulbIcon color="info" />
                  <Typography variant="h6" color="info.main" fontWeight={600}>
                    사용 팁 & 주의사항
                  </Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="담당자별 현황 활용" 
                      secondary="담당자 카드를 더블클릭하여 해당 담당자의 세부 업무 목록 확인" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="세부 업무 접근" 
                      secondary="담당자별 업무 리스트에서 세부 업무를 더블클릭하면 상세 정보 팝업" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="트리 탐색" 
                      secondary="Action Items에서 그룹 항목 클릭으로 하위 항목 확장/축소" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><TrendingUpIcon color="primary" fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="진행률 관리" 
                      secondary="정기적으로 업무 진행률을 업데이트하여 프로젝트 현황 파악" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><InfoIcon color="action" fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="완료 작업 표시" 
                      secondary="진행률 100% 작업은 녹색으로 표시되어 완료 상태 한눈에 확인" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText 
                      primary="브라우저 호환성" 
                      secondary="Chrome, Firefox, Safari, Edge 지원" 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* 문제 해결 */}
            <Card variant="outlined" sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.300' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <BuildIcon color="action" />
                  <Typography variant="h6" color="text.primary" fontWeight={600}>
                    문제 해결
                  </Typography>
                </Box>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>팝업이 열리지 않음</Typography>
                    <Typography variant="body2" color="text.secondary">
                      항목을 더블클릭하거나 적절한 요소를 클릭했는지 확인
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>데이터가 표시되지 않음</Typography>
                    <Typography variant="body2" color="text.secondary">
                      페이지 새로고침 또는 브라우저 캐시 삭제 후 재시도
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>편집이 저장되지 않음</Typography>
                    <Typography variant="body2" color="text.secondary">
                      네트워크 연결 상태 확인 후 재시도
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>Gantt 차트가 안 보임</Typography>
                    <Typography variant="body2" color="text.secondary">
                      브라우저 호환성 확인 및 JavaScript 활성화 상태 점검
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default UsageGuide

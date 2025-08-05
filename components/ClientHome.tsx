'use client'
import React from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Alert, 
  AlertTitle,
  Button,
  CircularProgress,
  Backdrop,
  Stack,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material'
import { 
  Error as ErrorIcon, 
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  TableChart as TableChartIcon 
} from '@mui/icons-material'
import { useTasksFromDatabase, useTaskAnalytics, useViewState } from '../hooks'
import Header from '../components/Header'
import StatsDashboard from '../components/StatsDashboard'
import RiskAnalysisComponent from '../components/RiskAnalysis'
import ResourceStatsComponent from '../components/ResourceStats'
import GanttChart from '../components/GanttChart'
import UsageGuide from '../components/UsageGuide'
import Loading from '../components/Loading'

export default function ClientHome() {
  const { tasks, loading, error, source, refetch, updateTask } = useTasksFromDatabase()
  
  // tasks가 유효한 배열인지 확인
  const safeTasks = Array.isArray(tasks) ? tasks : []
  
  const { stats, resourceStats, riskAnalysis } = useTaskAnalytics(safeTasks)
  const { viewMode, groupBy, setViewMode, setGroupBy } = useViewState()

  if (loading) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" component="div">
            프로젝트 데이터를 불러오는 중...
          </Typography>
        </Box>
      </Backdrop>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Card elevation={3}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom color="error">
              오류가 발생했습니다
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {error}
            </Typography>
            {source === 'excel_fallback' && (
              <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
                <AlertTitle>데이터베이스 연결 실패</AlertTitle>
                Excel 파일을 사용하여 데이터를 표시하고 있습니다.
              </Alert>
            )}
            <Button 
              variant="contained" 
              startIcon={<RefreshIcon />}
              onClick={refetch}
              size="large"
              sx={{ mt: 2 }}
            >
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </Container>
    )
  }
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header
        taskCount={safeTasks.length}
        source={source}
      />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* 페이지 헤더 */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                📊 MVNO 프로젝트 관리 시스템
              </Typography>
              <Typography variant="body1" color="text.secondary">
                스노우모바일 MVNO 프로젝트의 전체 진행 상황을 한눈에 관리하세요
              </Typography>
            </Box>
            <Box display="flex" gap={1} alignItems="center">
              <Chip 
                icon={<TableChartIcon />}
                label={`총 ${safeTasks.length}개 작업`}
                variant="outlined"
                color="primary"
              />
              {source === 'excel_fallback' && (
                <Chip 
                  icon={<StorageIcon />}
                  label="Excel 모드"
                  variant="outlined"
                  color="warning"
                />
              )}
            </Box>
          </Box>
        </Paper>

        {/* 대시보드 컨텐츠 */}
        <Stack spacing={3}>
          {/* 통계 대시보드 */}
          <StatsDashboard stats={stats} />

          {/* 리스크 분석 */}
          <RiskAnalysisComponent riskAnalysis={riskAnalysis} />

          {/* 간트 차트 */}
          <Paper elevation={2} sx={{ p: 2 }}>
            <GanttChart 
              tasks={safeTasks}
              viewMode={viewMode}
              groupBy={groupBy}
              onViewModeChange={setViewMode}
              onGroupByChange={setGroupBy}
              onTaskUpdate={updateTask}
            />
          </Paper>

          {/* 리소스 통계 */}
          <ResourceStatsComponent resourceStats={resourceStats} tasks={safeTasks} />

          {/* 사용 가이드 */}
          <UsageGuide />
        </Stack>
      </Container>
    </Box>
  )
}

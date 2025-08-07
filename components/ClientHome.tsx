'use client'
import React, { useState, useEffect, useCallback } from 'react'
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
import { Task } from '../types/task'
import Header from '../components/Header'
import StatsDashboard from '../components/StatsDashboard'
import RiskAnalysisComponent from '../components/RiskAnalysis'
import ResourceStatsComponent from '../components/ResourceStats'
import GanttChart from '../components/GanttChart'
import UsageGuide from '../components/UsageGuide'
import Loading from '../components/Loading'

export default function ClientHome() {
  const { tasks: dbTasks, loading, error, source, refetch, updateTask } = useTasksFromDatabase()
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  
  // Task 추가 핸들러
  const handleTaskAdd = useCallback(async (newTask: Partial<Task>) => {
    try {
      // 새로운 Task ID 생성 (기존 Task 중 가장 큰 번호 + 1)
      const existingIds = tasks.map(task => {
        const match = task.id.match(/TASK-(\d+)/)
        return match ? parseInt(match[1], 10) : 0
      })
      const nextId = Math.max(...existingIds, 0) + 1
      const taskId = `TASK-${String(nextId).padStart(3, '0')}`
      
      // 새로운 Task 객체 생성
      const taskToAdd: Task = {
        id: taskId,
        name: newTask.name || '새로운 업무',
        resource: newTask.resource || '',
        start: newTask.start || new Date(),
        end: newTask.end || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 기본 7일 후
        duration: newTask.duration || 7,
        percentComplete: newTask.percentComplete || 0,
        dependencies: newTask.dependencies || null,
        category: newTask.category || '',
        subcategory: newTask.subcategory || '',
        detail: newTask.detail || '',
        department: newTask.department || '',
        status: (newTask.status === '완료' || newTask.status === '진행중' || newTask.status === '미완료') 
          ? newTask.status 
          : '미완료', // 기본값을 '미완료'로 설정
        cost: newTask.cost || '',
        notes: newTask.notes || '',
        majorCategory: newTask.majorCategory || '',
        middleCategory: newTask.middleCategory || '',
        minorCategory: newTask.minorCategory || '',
        level: newTask.level || 2, // 기본적으로 세부업무로 설정
        parentId: newTask.parentId || '',
        hasChildren: false,
        isGroup: false
      }
      
      // API 호출하여 DB에 저장
      const response = await fetch('/api/tasks-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToAdd),
      })
      
      if (!response.ok) {
        throw new Error('Task 추가에 실패했습니다.')
      }
      
      const result = await response.json()
      if (result.success) {
        // 데이터를 다시 가져와서 최신 상태로 업데이트
        await refetch()
        
        // 성공 알림 (선택사항)
        console.log('Task가 성공적으로 추가되었습니다:', taskToAdd.name)
      } else {
        throw new Error(result.error || 'Task 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('Task 추가 중 오류 발생:', error)
      // 에러 처리 - 사용자에게 알림
      alert(error instanceof Error ? error.message : 'Task 추가 중 오류가 발생했습니다.')
    }
  }, [tasks])
  
  // Task 삭제 핸들러
  const handleTaskDelete = useCallback(async (taskId: string) => {
    try {
      // 로컬 상태에서 해당 Task 제거 (즉시 UI 업데이트)
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      
      console.log('Task가 성공적으로 삭제되었습니다:', taskId)
    } catch (error) {
      console.error('Task 삭제 중 오류 발생:', error)
      // 에러 시 데이터 다시 로드
      await refetch()
    }
  }, [refetch])
  
  // useTasksFromDatabase의 tasks가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    if (Array.isArray(dbTasks)) {
      setTasks(dbTasks)
    }
  }, [dbTasks])
  
  // Hydration 에러 방지를 위한 mounted 상태
  useEffect(() => {
    setMounted(true)
  }, [])
  
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
              <Typography variant="body1" color="text.secondary" component="div">
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
              {mounted && source === 'excel_fallback' && (
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
              onDataRefresh={refetch}
              onTaskAdd={handleTaskAdd}
              onTaskDelete={handleTaskDelete}
            />
          </Paper>

          {/* 리소스 통계 */}
          <ResourceStatsComponent 
            resourceStats={resourceStats} 
            tasks={safeTasks} 
            onTaskUpdate={updateTask}
          />

          {/* 사용 가이드 */}
          <UsageGuide />
        </Stack>
      </Container>
    </Box>
  )
}

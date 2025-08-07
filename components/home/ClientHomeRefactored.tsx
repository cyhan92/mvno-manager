'use client'
import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Alert, 
  AlertTitle,
  CircularProgress,
  Backdrop,
  Paper
} from '@mui/material'
import { 
  Error as ErrorIcon, 
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { useTasksFromDatabase } from '../../hooks'
import { useTaskManager } from '../../hooks/data/useTaskManager'
import { useTaskAnalytics } from '../../hooks'
import { Task } from '../../types/task'
import Header from '../Header'
import DashboardSection from './sections/DashboardSection'
import GanttChartSection from './sections/GanttChartSection'
import ResourceStatsComponent from '../ResourceStats'
import UsageGuideModular from '../UsageGuideModular'
import Loading from '../Loading'

const ClientHomeRefactored: React.FC = () => {
  const { tasks: dbTasks, loading, error, source, refetch, updateTask } = useTasksFromDatabase()
  const [tasks, setTasks] = useState<Task[]>([])
  
  const { 
    isLoading: isTaskLoading, 
    handleTaskAdd, 
    handleTaskUpdate, 
    handleTaskDelete,
    handleMajorCategoryUpdate,
    handleSubCategoryUpdate
  } = useTaskManager({ 
    tasks, 
    setTasks, 
    refetch 
  })

  const { resourceStats } = useTaskAnalytics(tasks)

  // 데이터 동기화
  useEffect(() => {
    if (dbTasks && dbTasks.length > 0) {
      setTasks(dbTasks)
    }
  }, [dbTasks])

  // 전체 데이터 새로고침 핸들러
  const handleDataRefresh = async () => {
    if (refetch) {
      await refetch()
    }
  }

  // 작업 업데이트 핸들러 (통합)
  const handleTaskUpdateIntegrated = (updatedTask: Task) => {
    handleTaskUpdate(updatedTask)
    if (updateTask) {
      updateTask(updatedTask)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <ErrorIcon />
              데이터 로드 오류
            </Box>
          </AlertTitle>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <button
            onClick={() => refetch?.()}
            className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
          >
            <RefreshIcon fontSize="small" />
            다시 시도
          </button>
        </Alert>
      </Container>
    )
  }

  return (
    <>
      <Header taskCount={tasks.length} source={source} />
      
      {/* 로딩 백드롭 */}
      {isTaskLoading && (
        <Backdrop open={isTaskLoading} sx={{ zIndex: 9999 }}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* 대시보드 섹션 */}
        <DashboardSection 
          tasks={tasks}
        />

        {/* 간트 차트 섹션 */}
        <GanttChartSection 
          tasks={tasks}
          onTaskUpdate={handleTaskUpdateIntegrated}
          onTaskAdd={handleTaskAdd}
          onTaskDelete={handleTaskDelete}
          onDataRefresh={handleDataRefresh}
          onMajorCategoryUpdate={handleMajorCategoryUpdate}
          onSubCategoryUpdate={handleSubCategoryUpdate}
        />

        {/* 담당자 현황 - Gantt 차트 아래에 위치 (기존과 동일) */}
        <Box mb={4}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            👥 담당자 현황
          </Typography>
          <Paper elevation={2} sx={{ p: 2 }}>
            <ResourceStatsComponent 
              resourceStats={resourceStats} 
              tasks={tasks}
              onTaskUpdate={handleTaskUpdateIntegrated}
            />
          </Paper>
        </Box>

        {/* 사용 가이드 - 기존과 동일하게 가장 아래 위치 */}
        <Box mb={4}>
          <UsageGuideModular />
        </Box>

        {/* 데이터 정보 */}
        {tasks.length > 0 && (
          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              총 {tasks.length}개의 작업이 로드되었습니다.
            </Typography>
          </Box>
        )}

        {/* 빈 상태 */}
        {!loading && tasks.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              📋 작업 데이터가 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Excel 파일을 업로드하거나 데이터베이스에서 작업을 불러오세요.
            </Typography>
          </Box>
        )}
      </Container>
    </>
  )
}

export default ClientHomeRefactored

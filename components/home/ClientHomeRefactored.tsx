'use client'
import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Alert, 
  AlertTitle,
  CircularProgress,
  Backdrop
} from '@mui/material'
import { 
  Error as ErrorIcon, 
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { useTasksFromDatabase } from '../../hooks'
import { useTaskManager } from '../../hooks/data/useTaskManager'
import { Task } from '../../types/task'
import Header from '../Header'
import DashboardSection from './sections/DashboardSection'
import GanttChartSection from './sections/GanttChartSection'
import UsageGuideModular from '../UsageGuideModular'
import Loading from '../Loading'

const ClientHomeRefactored: React.FC = () => {
  const { tasks: dbTasks, loading, error, source, refetch, updateTask } = useTasksFromDatabase()
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  
  const { 
    isLoading: isTaskLoading, 
    handleTaskAdd, 
    handleTaskUpdate, 
    handleTaskDelete 
  } = useTaskManager({ 
    tasks, 
    setTasks, 
    refetch 
  })

  // 데이터 동기화
  useEffect(() => {
    if (dbTasks && dbTasks.length > 0) {
      setTasks(dbTasks)
    }
  }, [dbTasks])

  // 클라이언트 마운트 처리
  useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!mounted) {
    return <Loading />
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
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* 사용 가이드 */}
        <Box mb={4}>
          <UsageGuideModular />
        </Box>

        {/* 대시보드 섹션 */}
        <DashboardSection 
          tasks={tasks}
          source={source}
          onTaskUpdate={handleTaskUpdateIntegrated}
        />

        {/* 간트 차트 섹션 */}
        <GanttChartSection 
          tasks={tasks}
          onTaskUpdate={handleTaskUpdateIntegrated}
          onTaskAdd={handleTaskAdd}
          onTaskDelete={handleTaskDelete}
          onDataRefresh={handleDataRefresh}
        />

        {/* 데이터 정보 */}
        {tasks.length > 0 && (
          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              총 {tasks.length}개의 작업이 로드되었습니다.
              {source && ` (데이터 소스: ${source})`}
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

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
  const [lastAction, setLastAction] = useState<{ type: 'add' | 'delete' | 'update' | null, timestamp: number }>({ type: null, timestamp: 0 })
  
  const { 
    isLoading: isTaskLoading, 
    handleTaskAdd, 
    handleTaskUpdate, 
    handleTaskDelete,
    handleMajorCategoryUpdate,
    handleSubCategoryUpdate,
    handleMoveMajorCategory
  } = useTaskManager({ 
    tasks, 
    setTasks, 
    refetch,
    onTaskAction: (action: 'add' | 'delete' | 'update') => {
      setLastAction({ type: action, timestamp: Date.now() })
    }
  })

  const { resourceStats } = useTaskAnalytics(tasks)

  // 데이터 동기화 (스마트 merge)
  useEffect(() => {
    if (dbTasks && dbTasks.length > 0) {
      // 현재 로컬 tasks와 DB tasks를 비교하여 스마트하게 merge
      setTasks(prevTasks => {
        // 만약 현재 tasks가 비어있으면 DB 데이터 사용 (초기 로드)
        if (prevTasks.length === 0) {
          console.log('🔄 DB 데이터로 초기화')
          return dbTasks
        }
        
        // 최근 3초 이내에 로컬 액션이 있었다면 덮어쓰기 방지
        // 단, update 액션의 경우에는 DB 동기화를 허용 (서버 처리 결과 반영)
        const recentActionTime = Date.now() - lastAction.timestamp
        if (lastAction.type && recentActionTime < 3000) {
          if (lastAction.type === 'update') {
            console.log(`✅ update 액션 후 DB 동기화 허용 (${recentActionTime}ms 전)`)
            return dbTasks
          } else {
            console.log(`🛡️ 최근 ${lastAction.type} 액션으로 인한 동기화 건너뜀 (${recentActionTime}ms 전)`)
            return prevTasks
          }
        }
        
        // DB에 더 많은 Task가 있으면 새로운 Task가 추가된 것으로 판단
        if (dbTasks.length > prevTasks.length) {
          console.log('📈 새로운 Task 추가 감지, DB 데이터로 동기화')
          return dbTasks
        }
        
        // DB에 더 적은 Task가 있으면 Task가 삭제된 것으로 판단
        if (dbTasks.length < prevTasks.length) {
          console.log('� Task 삭제 감지, DB 데이터로 동기화')
          return dbTasks
        }
        
        // 길이가 같으면 현재 로컬 상태 유지 (부분 업데이트 보호)
        console.log('🛡️ 로컬 상태 유지 (부분 업데이트 보호)')
        return prevTasks
      })
    }
  }, [dbTasks, lastAction])

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
          onTaskUpdate={handleTaskUpdateIntegrated}
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
          onMoveMajorCategory={handleMoveMajorCategory}
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

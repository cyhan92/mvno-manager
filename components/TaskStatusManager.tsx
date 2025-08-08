import React, { useState } from 'react'
import { Box, Typography, Button, Paper, Alert, CircularProgress, Divider } from '@mui/material'

interface StatusStats {
  completed: number
  inProgress: number
  notStarted: number
  total: number
}

interface StatusUpdateResponse {
  success: boolean
  message: string
  data?: {
    totalTasks: number
    updatedCount: number
    unchangedCount: number
    statusChanges: {
      completed: number
      inProgress: number
      notStarted: number
      unchanged: number
    }
    errors?: string[]
  }
}

interface StatusStatsResponse {
  success: boolean
  data?: {
    currentStats: StatusStats
    expectedStats: StatusStats
    mismatchCount: number
    needsUpdate: boolean
  }
}

const TaskStatusManager: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [result, setResult] = useState<StatusUpdateResponse | null>(null)
  const [stats, setStats] = useState<StatusStatsResponse['data'] | null>(null)

  // 현재 상태 통계 조회
  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const response = await fetch('/api/update-task-status', {
        method: 'GET'
      })
      const data: StatusStatsResponse = await response.json()
      
      if (data.success && data.data) {
        setStats(data.data)
      } else {
        console.error('통계 조회 실패:', data)
      }
    } catch (error) {
      console.error('통계 조회 중 오류:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  // 작업 상태 일괄 업데이트
  const updateTaskStatus = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/update-task-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data: StatusUpdateResponse = await response.json()
      
      // 실패한 경우에만 결과 표시
      if (!data.success) {
        setResult(data)
      }
      
      // 업데이트 후 통계 다시 조회 (성공/실패 관계없이)
      await fetchStats()
    } catch (error) {
      console.error('업데이트 실패:', error)
      setResult({
        success: false,
        message: '네트워크 오류가 발생했습니다.'
      })
    } finally {
      setLoading(false)
    }
  }

  // 페이지 로드 시 통계 조회
  React.useEffect(() => {
    fetchStats()
  }, [])

  return (
    <Box p={3} maxWidth={800} mx="auto">
      <Typography variant="h4" gutterBottom fontWeight={600}>
        🔧 작업 상태 관리
      </Typography>
      
      <Typography variant="body1" color="text.secondary" mb={4}>
        완료율에 따라 작업 상태를 자동으로 업데이트합니다.
      </Typography>

      {/* 현재 상태 통계 */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            📊 현재 상태 통계
          </Typography>
          <Button 
            onClick={fetchStats} 
            disabled={statsLoading}
            size="small"
            variant="outlined"
          >
            {statsLoading ? <CircularProgress size={20} /> : '새로고침'}
          </Button>
        </Box>

        {stats ? (
          <Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mb={3}>
              {/* 현재 상태 */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  현재 DB 상태
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" justifyContent="between">
                    <span>✅ 완료:</span>
                    <span>{stats.currentStats.completed}개</span>
                  </Box>
                  <Box display="flex" justifyContent="between">
                    <span>🔄 진행중:</span>
                    <span>{stats.currentStats.inProgress}개</span>
                  </Box>
                  <Box display="flex" justifyContent="between">
                    <span>⏸️ 미진행:</span>
                    <span>{stats.currentStats.notStarted}개</span>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="between" fontWeight={600}>
                    <span>전체:</span>
                    <span>{stats.currentStats.total}개</span>
                  </Box>
                </Box>
              </Box>

              {/* 예상 상태 (완료율 기준) */}
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  완료율 기준 예상 상태
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" justifyContent="between">
                    <span>✅ 완료 (100%):</span>
                    <span>{stats.expectedStats.completed}개</span>
                  </Box>
                  <Box display="flex" justifyContent="between">
                    <span>🔄 진행중 (1-99%):</span>
                    <span>{stats.expectedStats.inProgress}개</span>
                  </Box>
                  <Box display="flex" justifyContent="between">
                    <span>⏸️ 미진행 (0%):</span>
                    <span>{stats.expectedStats.notStarted}개</span>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="between" fontWeight={600}>
                    <span>전체:</span>
                    <span>{stats.expectedStats.total}개</span>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* 불일치 정보 */}
            {stats.needsUpdate && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>{stats.mismatchCount}개 작업</strong>의 상태가 완료율과 일치하지 않습니다.
                </Typography>
              </Alert>
            )}
            
            {!stats.needsUpdate && (
              <Alert severity="success">
                모든 작업의 상태가 완료율과 일치합니다.
              </Alert>
            )}
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress />
          </Box>
        )}
      </Paper>

      {/* 업데이트 버튼 */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          🔄 일괄 상태 업데이트
        </Typography>
        
        <Typography variant="body2" color="text.secondary" mb={3}>
          완료율에 따라 모든 작업의 상태를 다음과 같이 업데이트합니다:
        </Typography>
        
        <Box mb={3}>
          <Typography variant="body2">• 완료율 100% → 완료</Typography>
          <Typography variant="body2">• 완료율 1-99% → 진행중</Typography>
          <Typography variant="body2">• 완료율 0% → 미진행</Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={updateTaskStatus}
          disabled={loading || !stats?.needsUpdate}
          size="large"
          fullWidth
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              업데이트 중...
            </>
          ) : (
            '작업 상태 일괄 업데이트'
          )}
        </Button>

        {!stats?.needsUpdate && (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
            현재 모든 작업의 상태가 완료율과 일치하여 업데이트가 필요하지 않습니다.
          </Typography>
        )}
      </Paper>

      {/* 결과 표시 - 실패한 경우에만 */}
      {result && !result.success && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            ❌ 업데이트 오류
          </Typography>
          
          <Alert severity="error" sx={{ mb: 2 }}>
            {result.message}
          </Alert>

          {result.data && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                오류 상세 정보:
              </Typography>
              <Box pl={2}>
                {result.data.totalTasks && (
                  <Typography variant="body2">• 전체 작업: {result.data.totalTasks}개</Typography>
                )}
                {result.data.updatedCount !== undefined && (
                  <Typography variant="body2">• 업데이트됨: {result.data.updatedCount}개</Typography>
                )}
                {result.data.unchangedCount !== undefined && (
                  <Typography variant="body2">• 변경 없음: {result.data.unchangedCount}개</Typography>
                )}
                
                {result.data.errors && result.data.errors.length > 0 && (
                  <Box mt={1}>
                    <Typography variant="body2" color="error" fontWeight={600}>
                      발생한 오류들:
                    </Typography>
                    <Box pl={2} sx={{ maxHeight: 200, overflowY: 'auto' }}>
                      {result.data.errors.slice(0, 10).map((error, index) => (
                        <Typography key={index} variant="body2" color="error" sx={{ fontSize: '0.85rem' }}>
                          • {error}
                        </Typography>
                      ))}
                      {result.data.errors.length > 10 && (
                        <Typography variant="body2" color="error" fontStyle="italic">
                          ... 외 {result.data.errors.length - 10}개 오류 더 있음
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  )
}

export default TaskStatusManager

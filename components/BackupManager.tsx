import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Alert, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider
} from '@mui/material'
import { Backup, History, Schedule } from '@mui/icons-material'

interface BackupRecord {
  id: string
  backup_table_name: string
  backup_date: string
  backup_timestamp: string
  records_count: number
  status: string
  created_at: string
}

interface BackupResult {
  message: string
  backupTableName: string
  backupDate: string
  recordsCount: number
  timestamp: string
}

const BackupManager: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [latestBackup, setLatestBackup] = useState<BackupRecord | null>(null)
  const [lastBackup, setLastBackup] = useState<BackupResult | null>(null)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false)
  const [tableSetupNeeded, setTableSetupNeeded] = useState(false)

  // 컴포넌트 마운트 시 최신 백업 조회
  useEffect(() => {
    fetchLatestBackup()
    checkAutoBackupStatus()
  }, [])

  // 최신 백업 조회
  const fetchLatestBackup = async () => {
    try {
      const response = await fetch('/api/backup')
      const data = await response.json()
      
      if (response.ok) {
        setLatestBackup(data.latestBackup || null)
        if (data.error && data.error.includes('table may not exist')) {
          setTableSetupNeeded(true)
          // fetchLatestBackup이 자동 호출될 때는 오류 메시지 설정하지 않음
          // setError('백업 이력 테이블이 생성되지 않았습니다. 먼저 테이블을 설정해주세요.')
        } else {
          setTableSetupNeeded(false)
        }
      } else {
        // 자동 호출 시에는 오류 메시지 표시하지 않음
        console.log('No backup history available')
      }
    } catch (err) {
      console.error('Error fetching latest backup:', err)
      // 자동 호출 시에는 오류 메시지 표시하지 않음
    }
  }

  // 백업 테이블 설정
  const setupBackupTable = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setTableSetupNeeded(false) // 설정 시도 시 플래그 초기화
    
    try {
      const response = await fetch('/api/create-backup-table', {
        method: 'POST'
      })
      const data = await response.json()
      
      console.log('Setup response status:', response.status)
      console.log('Setup response data:', data) // 디버깅용
      
      if (response.ok) {
        if (data.tableExists === false && data.sql) {
          // 테이블이 존재하지 않음 - SQL 생성 스크립트 제공
          setTableSetupNeeded(true)
          setError(`백업 테이블을 수동으로 생성해야 합니다.\n\nSupabase 대시보드 → SQL Editor에서 다음 쿼리를 실행하세요:\n\n${data.sql}`)
        } else if (data.tableExists === true) {
          // 테이블이 존재하고 사용 가능
          setSuccess('백업 테이블이 준비되었습니다!')
          setTableSetupNeeded(false)
          setError('') // 명시적으로 오류 초기화
          fetchLatestBackup()
        } else {
          // 기타 성공 응답
          setSuccess(data.message || '백업 테이블 설정이 완료되었습니다.')
          setTableSetupNeeded(false)
          setError('') // 명시적으로 오류 초기화
          fetchLatestBackup()
        }
      } else {
        // 서버 오류
        console.error('Server error:', data)
        setTableSetupNeeded(true)
        setError(`백업 테이블 설정에 실패했습니다.\n오류: ${data.error}\n상세: ${data.details || '알 수 없는 오류'}`)
      }
    } catch (err) {
      console.error('Network error:', err)
      setTableSetupNeeded(true)
      setError('백업 테이블 설정 중 네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 자동 백업 상태 확인 (localStorage에서)
  const checkAutoBackupStatus = () => {
    const autoBackup = localStorage.getItem('autoBackupEnabled') === 'true'
    setAutoBackupEnabled(autoBackup)
  }

  // 수동 백업 실행
  const executeBackup = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      console.log('Backup response:', data) // 디버깅용

      if (response.ok) {
        setLastBackup(data)
        setSuccess(`백업이 성공적으로 완료되었습니다. (${data.recordsCount}개 레코드)`)
        fetchLatestBackup() // 최신 백업 정보 새로고침
      } else {
        // 백업 히스토리 테이블이 없는 경우
        if (data.error && data.error.includes('Backup history table does not exist')) {
          setTableSetupNeeded(true)
          setError('백업 히스토리 테이블이 생성되지 않았습니다.\n먼저 "테이블 설정하기" 버튼을 클릭하여 백업 테이블을 생성해주세요.')
        } else {
          setError(`백업 실패: ${data.error}\n상세: ${data.details || '알 수 없는 오류'}`)
        }
      }
    } catch (err) {
      setError('백업 요청 중 네트워크 오류가 발생했습니다.')
      console.error('Backup error:', err)
    } finally {
      setLoading(false)
    }
  }

  // 자동 백업 토글
  const toggleAutoBackup = () => {
    const newStatus = !autoBackupEnabled
    setAutoBackupEnabled(newStatus)
    localStorage.setItem('autoBackupEnabled', newStatus.toString())
    
    if (newStatus) {
      setSuccess('자동 백업이 활성화되었습니다. 매일 자정에 백업이 실행됩니다.')
      scheduleNextBackup()
    } else {
      setSuccess('자동 백업이 비활성화되었습니다.')
    }
  }

  // 다음 백업 스케줄링
  const scheduleNextBackup = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0) // 자정으로 설정

    const timeUntilBackup = tomorrow.getTime() - now.getTime()

    setTimeout(() => {
      if (localStorage.getItem('autoBackupEnabled') === 'true') {
        executeBackup()
        scheduleNextBackup() // 다음날 백업 재스케줄링
      }
    }, timeUntilBackup)
  }

  // 자동 백업이 활성화되면 스케줄링 시작
  useEffect(() => {
    if (autoBackupEnabled) {
      scheduleNextBackup()
    }
  }, [autoBackupEnabled])

  // 날짜 포맷팅
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR')
  }

  // 오늘 백업 여부 확인
  const hasBackupToday = () => {
    if (!latestBackup) return false
    const today = new Date().toISOString().split('T')[0]
    return latestBackup.backup_date === today
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Backup color="primary" />
            데이터베이스 백업 관리
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            중요한 데이터를 안전하게 보관하기 위해 정기적으로 백업을 수행합니다. 최신 백업 하나만 유지됩니다.
          </Typography>

          {/* 테이블 설정 필요 시 안내 */}
          {tableSetupNeeded && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="subtitle2">백업 테이블 설정이 필요합니다</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                백업 기능을 사용하기 위해 먼저 데이터베이스 테이블을 설정해야 합니다.
              </Typography>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={setupBackupTable}
                disabled={loading}
              >
                테이블 설정하기
              </Button>
            </Alert>
          )}

          {/* 알림 메시지 */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {/* 백업 상태 */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Schedule />}
              label={`자동 백업: ${autoBackupEnabled ? '활성화' : '비활성화'}`}
              color={autoBackupEnabled ? 'success' : 'default'}
              variant="outlined"
            />
            <Chip 
              label={`오늘 백업: ${hasBackupToday() ? '완료' : '미완료'}`}
              color={hasBackupToday() ? 'success' : 'warning'}
              variant="outlined"
            />
          </Box>

          {/* 백업 버튼들 */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={executeBackup}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Backup />}
            >
              {loading ? '백업 중...' : '수동 백업 실행'}
            </Button>
            
            <Button
              variant="outlined"
              color={autoBackupEnabled ? 'error' : 'success'}
              onClick={toggleAutoBackup}
              startIcon={<Schedule />}
            >
              자동 백업 {autoBackupEnabled ? '비활성화' : '활성화'}
            </Button>
          </Box>

          {/* 최근 백업 정보 */}
          {lastBackup && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2">최근 백업 정보</Typography>
              <Typography variant="body2">
                백업 날짜: {lastBackup.backupDate} | 
                레코드 수: {lastBackup.recordsCount}개 | 
                테이블명: {lastBackup.backupTableName}
              </Typography>
            </Alert>
          )}

          <Divider sx={{ my: 3 }} />

          {/* 최신 백업 정보 */}
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History color="primary" />
            최신 백업 정보
          </Typography>

          {latestBackup ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>백업 날짜</TableCell>
                    <TableCell>백업 시간</TableCell>
                    <TableCell align="right">레코드 수</TableCell>
                    <TableCell>테이블명</TableCell>
                    <TableCell>상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{latestBackup.backup_date}</TableCell>
                    <TableCell>{formatDateTime(latestBackup.backup_timestamp)}</TableCell>
                    <TableCell align="right">{latestBackup.records_count.toLocaleString()}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      {latestBackup.backup_table_name}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={latestBackup.status} 
                        color={latestBackup.status === 'completed' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              아직 백업이 없습니다. 첫 번째 백업을 실행해보세요.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default BackupManager

import { useEffect } from 'react'

const AutoBackupScheduler = () => {
  useEffect(() => {
    const scheduleBackup = () => {
      const now = new Date()
      const lastBackupDate = localStorage.getItem('lastBackupDate')
      const today = now.toISOString().split('T')[0]
      
      // 자동 백업이 활성화되어 있고, 오늘 아직 백업하지 않았다면
      const autoBackupEnabled = localStorage.getItem('autoBackupEnabled') === 'true'
      
      if (autoBackupEnabled && lastBackupDate !== today) {
        // 자정 이후 첫 접속 시 백업 실행
        const currentHour = now.getHours()
        
        if (currentHour >= 0 && currentHour < 6) { // 자정~새벽 6시 사이
          executeAutoBackup()
        } else {
          // 다음 자정까지 대기
          const tomorrow = new Date(now)
          tomorrow.setDate(tomorrow.getDate() + 1)
          tomorrow.setHours(0, 0, 0, 0)
          
          const timeUntilMidnight = tomorrow.getTime() - now.getTime()
          
          setTimeout(() => {
            executeAutoBackup()
          }, timeUntilMidnight)
        }
      }
    }

    const executeAutoBackup = async () => {
      try {
        const autoBackupEnabled = localStorage.getItem('autoBackupEnabled') === 'true'
        if (!autoBackupEnabled) return

        console.log('Executing automatic backup...')
        
        const response = await fetch('/api/backup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          const today = new Date().toISOString().split('T')[0]
          localStorage.setItem('lastBackupDate', today)
          
          console.log('Automatic backup completed:', data)
          
          // 선택적: 사용자에게 알림 (너무 침해적이지 않도록 조심스럽게)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('자동 백업 완료', {
              body: `${data.recordsCount}개 레코드가 백업되었습니다.`,
              icon: '/favicon.ico'
            })
          }
        } else {
          console.error('Automatic backup failed:', await response.text())
        }
      } catch (error) {
        console.error('Error in automatic backup:', error)
      }
    }

    // 알림 권한 요청 (선택적)
    const requestNotificationPermission = () => {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }

    // 페이지 로드 시 백업 스케줄링
    scheduleBackup()
    requestNotificationPermission()

    // 하루에 한 번 확인하는 인터벌 설정 (24시간마다)
    const interval = setInterval(() => {
      scheduleBackup()
    }, 24 * 60 * 60 * 1000) // 24시간

    // 페이지 가시성 변경 시에도 확인 (사용자가 페이지로 돌아왔을 때)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        scheduleBackup()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null // 이 컴포넌트는 UI를 렌더링하지 않음
}

export default AutoBackupScheduler

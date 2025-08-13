import { useEffect } from 'react'
import { Task } from '../../types/task'

interface UseSynchronizedRenderingProps {
  displayTasks: Task[]
  expandedNodesSize: number
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  renderChart?: () => void
  triggerRender: () => void
  resyncHorizontal?: () => void // 스크롤 재동기화 함수 추가
}

export const useSynchronizedRendering = ({
  displayTasks,
  expandedNodesSize,
  canvasRef,
  renderChart,
  triggerRender,
  resyncHorizontal
}: UseSynchronizedRenderingProps) => {
  // 트리 상태가 변경될 때마다 캔버스 다시 그리기
  useEffect(() => {
    // 트리 변경 시 부드러운 단일 렌더링
    if (canvasRef.current && displayTasks.length > 0) {
      const syncRender = () => {
        if (renderChart) {
          renderChart() // 메인 차트 렌더링
          
          // 헤더 렌더링 트리거 (한 번만)
          setTimeout(() => {
            triggerRender() // 디바운싱된 함수 사용
            
            // 렌더링 후 스크롤 재동기화 (대분류 이동 등의 내부 리프레시 대응)
            if (resyncHorizontal) {
              setTimeout(() => {
                resyncHorizontal()
                console.log('useSynchronizedRendering: 렌더링 후 스크롤 재동기화 실행')
              }, 100)
              
              // 추가 재동기화 (안전장치)
              setTimeout(() => {
                resyncHorizontal()
              }, 200)
            }
          }, 80) // 메인 차트 렌더링 완료 후 적절한 지연
        }
      }
      
      // DOM 업데이트 완료 후 렌더링
      const timer = setTimeout(syncRender, 50)
      
      return () => clearTimeout(timer)
    }
  }, [displayTasks.length, expandedNodesSize, renderChart, canvasRef, triggerRender])
}

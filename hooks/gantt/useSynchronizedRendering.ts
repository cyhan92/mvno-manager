import { useEffect } from 'react'
import { Task } from '../../types/task'

interface UseSynchronizedRenderingProps {
  displayTasks: Task[]
  expandedNodesSize: number
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  renderChart?: () => void
  triggerRender: () => void
}

export const useSynchronizedRendering = ({
  displayTasks,
  expandedNodesSize,
  canvasRef,
  renderChart,
  triggerRender
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
          }, 80) // 메인 차트 렌더링 완료 후 적절한 지연
        }
      }
      
      // DOM 업데이트 완료 후 렌더링
      const timer = setTimeout(syncRender, 50)
      
      return () => clearTimeout(timer)
    }
  }, [displayTasks.length, expandedNodesSize, renderChart, canvasRef, triggerRender])
}

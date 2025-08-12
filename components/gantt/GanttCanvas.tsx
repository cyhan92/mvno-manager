import React from 'react'
import { styles } from '../../styles'

interface GanttCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  isLoading: boolean
  onCanvasClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
  onCanvasDoubleClick: (event: React.MouseEvent<HTMLCanvasElement>) => void
  scrollRef: React.RefObject<HTMLDivElement | null>
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

const GanttCanvas: React.FC<GanttCanvasProps> = ({
  canvasRef,
  containerRef,
  isLoading,
  onCanvasClick,
  onCanvasDoubleClick,
  scrollRef,
  onScroll
}) => {
  return (
    <div 
      ref={scrollRef}
      className={`${styles.ganttChartContent} ${styles.ganttChartContentDynamic} ${styles.ganttChartViewport}`}
      onScroll={onScroll}
    >
      <div ref={containerRef} className="relative">
        <canvas 
          ref={canvasRef}
          onClick={onCanvasClick}
          onDoubleClick={onCanvasDoubleClick}
          className={styles.ganttCanvas}
        />
        {isLoading && (
          <div className={`${styles.loadingContainer} absolute inset-0 flex items-center justify-center bg-white bg-opacity-75`}>
            <div className={styles.loadingSpinner} />
            <p className="text-gray-500 ml-2">차트를 그리고 있습니다...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GanttCanvas

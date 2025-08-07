import { useRef, useState } from 'react'

export const useGanttCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentChartWidth, setCurrentChartWidth] = useState<number>(0)

  const getCanvas = () => canvasRef.current
  const getContainer = () => containerRef.current
  const getContext = () => canvasRef.current?.getContext('2d') || null

  const updateChartWidth = (width: number) => {
    setCurrentChartWidth(width)
  }

  return {
    canvasRef,
    containerRef,
    currentChartWidth,
    getCanvas,
    getContainer,
    getContext,
    updateChartWidth
  }
}

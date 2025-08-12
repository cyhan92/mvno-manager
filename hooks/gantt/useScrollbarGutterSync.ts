import { useEffect } from 'react'

interface UseScrollbarGutterSyncProps {
  headerScrollRef: React.RefObject<HTMLDivElement | null>
  ganttChartScrollRef: React.RefObject<HTMLDivElement | null>
}

/**
 * 차트 영역에 세로 스크롤바가 생길 때 헤더에도 동일한 오른쪽 패딩을 적용하여
 * 가시 영역 폭을 일치시키는 훅. 브라우저가 scrollbar-gutter를 지원하지 않더라도 동작.
 */
export const useScrollbarGutterSync = ({
  headerScrollRef,
  ganttChartScrollRef
}: UseScrollbarGutterSyncProps) => {
  useEffect(() => {
    const header = headerScrollRef.current
    const chart = ganttChartScrollRef.current
    if (!header || !chart) return

    const applyGutter = () => {
      // 세로 스크롤바 너비 계산: offsetWidth - clientWidth
      const gutter = Math.max(0, chart.offsetWidth - chart.clientWidth)
      // 필요할 때만 패딩 적용 (불필요한 reflow 방지)
      const targetPadding = gutter > 0 ? `${gutter}px` : ''
      if (header.style.paddingRight !== targetPadding) {
        header.style.paddingRight = targetPadding
      }
    }

    // 초기 적용
    applyGutter()

    // 차트 컨테이너 크기 변화를 감지하여 갱신
    const resizeObserver = new ResizeObserver(() => {
      // 다음 프레임에서 계산 (레이아웃 안정 후)
      requestAnimationFrame(applyGutter)
    })
    resizeObserver.observe(chart)

    // 스크롤/컨텐츠 변화 시도 대응 (안전망)
    const handleScroll = () => requestAnimationFrame(applyGutter)
    chart.addEventListener('scroll', handleScroll, { passive: true })

    // 윈도우 리사이즈 대응
    const handleWindowResize = () => requestAnimationFrame(applyGutter)
    window.addEventListener('resize', handleWindowResize)

    return () => {
      chart.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleWindowResize)
      resizeObserver.disconnect()
      // 정리: 헤더 패딩 제거
      if (header) header.style.paddingRight = ''
    }
  }, [headerScrollRef, ganttChartScrollRef])
}

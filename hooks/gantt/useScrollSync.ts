import { useCallback, useEffect, useRef } from 'react'

export interface UseScrollSyncOptions {
  toleranceRatio?: number // 허용 오차 (비율)
  rounding?: boolean // 픽셀 라운딩 적용 여부
}

export const useScrollSync = (options: UseScrollSyncOptions = {}) => {
  const { toleranceRatio = 0.005, rounding = true } = options

  const actionItemScrollRef = useRef<HTMLDivElement>(null)
  const ganttChartScrollRef = useRef<HTMLDivElement>(null)
  const headerScrollRef = useRef<HTMLDivElement>(null)
  const isScrollingSyncRef = useRef(false)
  const lastChartScrollStateRef = useRef<{ hasH: boolean; max: number } | null>(null)

  // 세로 스크롤 동기화 (Action ↔ Chart)
  const handleActionItemScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSyncRef.current) return
    const scrollTop = e.currentTarget.scrollTop
    if (ganttChartScrollRef.current) {
      isScrollingSyncRef.current = true
      ganttChartScrollRef.current.scrollTop = scrollTop
      requestAnimationFrame(() => { isScrollingSyncRef.current = false })
    }
  }, [])

  const handleGanttChartScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSyncRef.current) return
    const scrollTop = e.currentTarget.scrollTop
    const source = e.currentTarget
    const sourceMax = Math.max(1, source.scrollWidth - source.clientWidth)
    const ratio = sourceMax > 0 ? source.scrollLeft / sourceMax : 0

    // 가로 스크롤바 등장/변화 감지 후, 다음 프레임에서 헤더 재동기화
    const hasH = source.scrollWidth > source.clientWidth
    const prev = lastChartScrollStateRef.current
    lastChartScrollStateRef.current = { hasH, max: sourceMax }

    isScrollingSyncRef.current = true
    if (actionItemScrollRef.current) {
      actionItemScrollRef.current.scrollTop = scrollTop
    }
    if (headerScrollRef.current) {
      const target = headerScrollRef.current
      const targetMax = Math.max(0, target.scrollWidth - target.clientWidth)
      const targetLeft = rounding ? Math.round(ratio * targetMax) : ratio * targetMax
      target.scrollLeft = targetLeft
    }
    requestAnimationFrame(() => {
      // 소스의 가로 스크롤 가능 상태가 바뀌었거나 max가 달라졌다면 한번 더 비율 재보정
      const currMax = Math.max(1, source.scrollWidth - source.clientWidth)
      const currHasH = source.scrollWidth > source.clientWidth
      const changed = !prev || prev.hasH !== currHasH || Math.abs(prev.max - currMax) > 0
      if (changed && headerScrollRef.current) {
        const h = headerScrollRef.current
        const hMax = Math.max(0, h.scrollWidth - h.clientWidth)
        const hLeft = rounding ? Math.round((source.scrollLeft / currMax) * hMax) : (source.scrollLeft / currMax) * hMax
        h.scrollLeft = hLeft
      }
      isScrollingSyncRef.current = false
    })
  }, [rounding])

  const handleHeaderScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSyncRef.current) return
    const source = e.currentTarget
    const sourceMax = Math.max(1, source.scrollWidth - source.clientWidth)
    const ratio = sourceMax > 0 ? source.scrollLeft / sourceMax : 0
    const hasH = source.scrollWidth > source.clientWidth

    if (ganttChartScrollRef.current) {
      isScrollingSyncRef.current = true
      const target = ganttChartScrollRef.current
      const targetMax = Math.max(0, target.scrollWidth - target.clientWidth)
      const targetLeft = rounding ? Math.round(ratio * targetMax) : ratio * targetMax
      target.scrollLeft = targetLeft
      requestAnimationFrame(() => {
        const currMax = Math.max(1, target.scrollWidth - target.clientWidth)
        const currHasH = target.scrollWidth > target.clientWidth
        if (hasH !== currHasH) {
          const newLeft = rounding ? Math.round((source.scrollLeft / sourceMax) * currMax) : (source.scrollLeft / sourceMax) * currMax
          target.scrollLeft = newLeft
        }
        isScrollingSyncRef.current = false
      })
    }
  }, [rounding])

  // 외부에서 강제로 가로 스크롤 동기화 재보정
  const resyncHorizontal = useCallback(() => {
    const g = ganttChartScrollRef.current
    const h = headerScrollRef.current
    if (!g || !h) return
    const gMax = Math.max(1, g.scrollWidth - g.clientWidth)
    const ratio = gMax > 0 ? g.scrollLeft / gMax : 0
    const hMax = Math.max(0, h.scrollWidth - h.clientWidth)
    const desired = rounding ? Math.round(ratio * hMax) : ratio * hMax
    if (Math.abs(h.scrollLeft - desired) > 0.5) {
      h.scrollLeft = desired
    }
  }, [rounding])

  // 초기 스크롤 위치 설정 (ratio 기반)
  const setInitialScrollPosition = useCallback((leftPx: number) => {
    const attempt = (tries = 0) => {
      if (tries > 20) return
      const g = ganttChartScrollRef.current
      const h = headerScrollRef.current
      if (!g || !h) {
        setTimeout(() => attempt(tries + 1), 50)
        return
      }
      isScrollingSyncRef.current = true
      requestAnimationFrame(() => {
        // 차트에는 정확한 픽셀 값 사용
        const gMax = Math.max(1, g.scrollWidth - g.clientWidth)
        const gLeft = Math.min(leftPx, gMax) // 최대값 제한
        g.scrollLeft = gLeft
        
        // 헤더에도 동일한 픽셀 값 시도 (비율 변환 없이)
        const hMax = Math.max(0, h.scrollWidth - h.clientWidth)
        const hLeft = Math.min(leftPx, hMax) // 헤더 최대값 제한
        h.scrollLeft = hLeft
        
        console.log('setInitialScrollPosition 실행:', {
          target: leftPx,
          chart: { max: gMax, set: gLeft, actual: g.scrollLeft },
          header: { max: hMax, set: hLeft, actual: h.scrollLeft }
        })
        
        requestAnimationFrame(() => {
          isScrollingSyncRef.current = false
          // 최종 검증 (픽셀 기준)
          const actualG = g.scrollLeft
          const actualH = h.scrollLeft
          const pixelDiff = Math.abs(actualG - actualH)
          
          if (pixelDiff > 1) { // 1픽셀 이상 차이나면 재조정
            console.log('스크롤 위치 불일치 감지:', { chart: actualG, header: actualH, diff: pixelDiff })
            // 차트 기준으로 헤더 재조정
            h.scrollLeft = Math.min(actualG, hMax)
          }
        })
      })
    }
    attempt()
  }, [rounding, toleranceRatio])

  // 헤더 거터(세로 스크롤바 폭) 패딩 동기화
  useEffect(() => {
    const header = headerScrollRef.current
    const chart = ganttChartScrollRef.current
    if (!header || !chart) return

    const applyGutter = () => {
      // 실제 스크롤바 폭 계산 (Windows/브라우저 차이 반영)
      const gutter = Math.max(0, chart.offsetWidth - chart.clientWidth)
      const targetPadding = gutter > 0 ? `${gutter}px` : ''
      const paddingChanged = header.style.paddingRight !== targetPadding
      if (paddingChanged) header.style.paddingRight = targetPadding
  // 헤더 폭은 CSS(box-sizing: border-box, width: auto/100%)에 맡기고, 우측 패딩만 동기화

      // 중요: 패딩 변경 직후 헤더 가로 스크롤을 차트의 현재 비율에 맞춰 재보정
      // 이렇게 해야 오늘선/세로선이 패딩 변화로 인해 1px 어긋나는 현상을 방지
      const cMax = Math.max(1, chart.scrollWidth - chart.clientWidth)
      const ratio = cMax > 0 ? chart.scrollLeft / cMax : 0
      const hMax = Math.max(0, header.scrollWidth - header.clientWidth)
      const desired = rounding ? Math.round(ratio * hMax) : ratio * hMax
      // 미세 차이일 때만 적용하여 불필요한 쓰기를 방지
      if (Math.abs(header.scrollLeft - desired) > 0.5) {
        header.scrollLeft = desired
      }
    }

    // 초기 적용 + 첫 몇 프레임 보정 (레이아웃 안정 전 후 변동 대비)
    applyGutter()
    requestAnimationFrame(applyGutter)
    setTimeout(() => requestAnimationFrame(applyGutter), 0)

    const ro = new ResizeObserver(() => requestAnimationFrame(applyGutter))
    ro.observe(chart)
    const onScroll = () => requestAnimationFrame(applyGutter)
    chart.addEventListener('scroll', onScroll, { passive: true })
    const onWin = () => requestAnimationFrame(applyGutter)
    window.addEventListener('resize', onWin)

    // overflowY/style/class 변경(세로 스크롤바 등장/제거) 감지
    const mo = new MutationObserver(() => requestAnimationFrame(applyGutter))
    mo.observe(chart, { attributes: true, attributeFilter: ['style', 'class'] })
    return () => {
      chart.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onWin)
  ro.disconnect()
  header.style.paddingRight = ''
      mo.disconnect()
    }
  }, [])

  return {
    actionItemScrollRef,
    ganttChartScrollRef,
    headerScrollRef,
    handleActionItemScroll,
    handleGanttChartScroll,
    handleHeaderScroll,
  setInitialScrollPosition,
  resyncHorizontal
  }
}

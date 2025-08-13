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
    const sourceScrollLeft = source.scrollLeft

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
      
      // 절대 픽셀 기반 동기화
      const targetLeft = Math.min(sourceScrollLeft, targetMax)
      const currentTargetScroll = target.scrollLeft
      
      // 의미있는 차이가 있을 때만 업데이트 (연쇄 방지)
      if (Math.abs(currentTargetScroll - targetLeft) > 0.5) {
        target.scrollLeft = targetLeft
        
        console.log('Chart → Header 스크롤 동기화:', {
          chart: { scroll: sourceScrollLeft, max: sourceMax },
          header: { set: targetLeft, max: targetMax, actual: target.scrollLeft }
        })
      }
    }
    requestAnimationFrame(() => {
      isScrollingSyncRef.current = false
    })
  }, [rounding])

  const handleHeaderScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSyncRef.current) return
    const source = e.currentTarget
    const sourceMax = Math.max(1, source.scrollWidth - source.clientWidth)
    const sourceScrollLeft = source.scrollLeft

    if (ganttChartScrollRef.current) {
      isScrollingSyncRef.current = true
      const target = ganttChartScrollRef.current
      const targetMax = Math.max(0, target.scrollWidth - target.clientWidth)
      
      // 절대 픽셀 기반 동기화
      const targetLeft = Math.min(sourceScrollLeft, targetMax)
      const currentTargetScroll = target.scrollLeft
      
      // 의미있는 차이가 있을 때만 업데이트 (연쇄 방지)
      if (Math.abs(currentTargetScroll - targetLeft) > 0.5) {
        target.scrollLeft = targetLeft
        
        console.log('Header → Chart 스크롤 동기화:', {
          header: { scroll: sourceScrollLeft, max: sourceMax },
          chart: { set: targetLeft, max: targetMax, actual: target.scrollLeft }
        })
      }
      
      // 다음 프레임에서 동기화 해제
      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false
      })
    }
  }, [rounding])

  // 외부에서 강제로 가로 스크롤 동기화 재보정 - 동기화 충돌 방지
  const resyncHorizontal = useCallback(() => {
    if (isScrollingSyncRef.current) return // 동기화 중일 때는 건너뜀
    
    const g = ganttChartScrollRef.current
    const h = headerScrollRef.current
    if (!g || !h) return
    
    // 차트 기준으로 헤더 동기화 (절대 픽셀 기반)
    const gScrollLeft = g.scrollLeft
    const hMax = Math.max(0, h.scrollWidth - h.clientWidth)
    const desired = Math.min(gScrollLeft, hMax)
    
    if (Math.abs(h.scrollLeft - desired) > 0.5) {
      // 임시로 동기화 차단하여 연쇄 호출 방지
      isScrollingSyncRef.current = true
      h.scrollLeft = desired
      console.log('resyncHorizontal 실행:', { chart: gScrollLeft, header: { desired, actual: h.scrollLeft } })
      
      // 다음 프레임에서 해제
      requestAnimationFrame(() => {
        isScrollingSyncRef.current = false
      })
    }
  }, [rounding])

  // 초기 스크롤 위치 설정 - 실시간 동기화와의 충돌 방지
  const setInitialScrollPosition = useCallback((leftPx: number) => {
    const attempt = (tries = 0) => {
      if (tries > 20) return
      const g = ganttChartScrollRef.current
      const h = headerScrollRef.current
      if (!g || !h) {
        setTimeout(() => attempt(tries + 1), 50)
        return
      }
      
      // 동기화 차단: 초기 설정 중에는 실시간 동기화 비활성화
      isScrollingSyncRef.current = true
      
      // 동시에 설정하여 이벤트 핸들러 간섭 최소화
      const gMax = Math.max(1, g.scrollWidth - g.clientWidth)
      const hMax = Math.max(0, h.scrollWidth - h.clientWidth)
      const gLeft = Math.min(leftPx, gMax)
      const hLeft = Math.min(leftPx, hMax)
      
      // 즉시 설정 (requestAnimationFrame 없이)
      g.scrollLeft = gLeft
      h.scrollLeft = hLeft
      
      console.log('setInitialScrollPosition 실행:', {
        target: leftPx,
        chart: { max: gMax, set: gLeft, actual: g.scrollLeft },
        header: { max: hMax, set: hLeft, actual: h.scrollLeft }
      })
      
      // 두 프레임 후에 동기화 재활성화 (충분한 지연)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isScrollingSyncRef.current = false
          
          // 최종 검증 및 재조정
          const actualG = g.scrollLeft
          const actualH = h.scrollLeft
          const pixelDiff = Math.abs(actualG - actualH)
          
          if (pixelDiff > 1) {
            console.log('초기 스크롤 재조정:', { chart: actualG, header: actualH, diff: pixelDiff })
            // 차트 기준으로 헤더 재조정 (동기화 비활성화 상태에서)
            isScrollingSyncRef.current = true
            h.scrollLeft = Math.min(actualG, hMax)
            // 다음 프레임에서 동기화 재활성화
            requestAnimationFrame(() => {
              isScrollingSyncRef.current = false
            })
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

'use client'
import createCache from '@emotion/cache'

const isBrowser = typeof document !== 'undefined'

// emotion cache 생성 함수
export function createEmotionCache() {
  let insertionPoint

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]',
    )
    insertionPoint = emotionInsertionPoint ?? undefined
  }

  return createCache({
    key: 'mui-style',
    insertionPoint,
    prepend: true,
    // SSR 호환성을 위한 설정 추가
    speedy: false,
  })
}

// 클라이언트 측 emotion cache (지연 초기화)
let clientCache: ReturnType<typeof createEmotionCache> | undefined

export function getClientSideEmotionCache() {
  if (!clientCache) {
    clientCache = createEmotionCache()
  }
  return clientCache
}

// 호환성을 위한 기본 export
export const clientSideEmotionCache = isBrowser ? getClientSideEmotionCache() : createEmotionCache()

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
  })
}

// 클라이언트 측 emotion cache
export const clientSideEmotionCache = createEmotionCache()

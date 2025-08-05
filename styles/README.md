# CSS 모듈화 구조

CSS 파일들이 기능별로 모듈화되어 관리의 편의성과 유지보수성을 높였습니다.

## 모듈 구조

### 1. `gantt-layout.module.css`
간트차트의 전체적인 레이아웃과 컨테이너 관련 스타일
- 간트차트 헤더
- 컨테이너 및 스크롤 관련
- 캔버스 관련
- 로딩 스피너
- 주별/월별 표시 전환

### 2. `action-items.module.css`
Action Item 영역의 스타일
- Action Item 영역 레이아웃
- 헤더 스타일
- 리스트 및 행 스타일
- 기본 배경색 및 텍스트

### 3. `tree-structure.module.css`
트리 구조 관련 스타일
- 트리 노드 구조
- 토글 버튼
- 아이콘 및 텍스트
- 레벨별 들여쓰기
- 레벨별 기본 배경색

### 4. `hover-effects.module.css`
모든 호버 효과 관련 스타일
- Action Item 행 호버 효과
- 그룹 행 특별 호버 효과
- 트리 토글 버튼 호버 효과
- 아이콘 및 텍스트 호버 효과
- 레벨별 차별화된 호버 효과

### 5. `popup.module.css`
팝업 관련 스타일
- 팝업 컨테이너
- 배경 오버레이
- 진행률 바
- 반응형 위치 조정

### 6. `common.module.css`
공통 스타일 요소
- 대시보드 진행률 바
- 리소스 진행률 바
- 기타 공통 UI 요소

## 사용 방법

### 1. 통합 import (권장)
```typescript
import styles from '../../styles'
```

### 2. 개별 모듈 import
```typescript
import { ganttLayoutStyles, hoverEffectsStyles } from '../../styles'
```

### 3. 특정 모듈만 import
```typescript
import hoverEffectsStyles from '../../styles/hover-effects.module.css'
```

## 장점

### 1. **관심사 분리**
- 각 모듈이 특정 기능에만 집중
- 코드 가독성 향상
- 버그 추적 용이

### 2. **유지보수성**
- 특정 기능 수정시 해당 모듈만 편집
- 사이드 이펙트 최소화
- 코드 리뷰 효율성 증대

### 3. **재사용성**
- 필요한 모듈만 선택적 import
- 다른 컴포넌트에서 특정 스타일만 재사용 가능
- 번들 크기 최적화

### 4. **협업 효율성**
- 각 개발자가 담당 영역의 CSS만 수정
- 병합 충돌 최소화
- 명확한 책임 분담

## 파일 크기 비교

- **기존**: `components.module.css` (416줄)
- **모듈화 후**: 6개 파일로 분산 (평균 40-70줄)

## 향후 확장

새로운 기능 추가시 해당하는 모듈에 추가하거나, 새로운 모듈을 생성하여 확장 가능:

```text
styles/
├── gantt-layout.module.css
├── action-items.module.css  
├── tree-structure.module.css
├── hover-effects.module.css
├── popup.module.css
├── common.module.css
├── new-feature.module.css  ← 새 기능 추가
└── index.ts                ← 통합 export
```

## 마이그레이션

기존 `components.module.css`는 완전히 제거되었으며, 필요한 공통 스타일은 `common.module.css`로 이전되었습니다.

모든 컴포넌트는 새로운 모듈 구조를 사용하도록 업데이트되었습니다.

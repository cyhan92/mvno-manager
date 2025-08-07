# 리팩토링 문서

## 개요
이 문서는 MVNO 프로젝트의 모듈화 리팩토링 작업을 기록합니다.

## 리팩토링 목표
1. **코드 재사용성 향상**: 큰 컴포넌트를 작은 단위로 분해
2. **유지보수성 향상**: 책임 분리를 통한 코드 구조 개선
3. **확장성 향상**: 새로운 기능 추가시 영향 범위 최소화

## 완료된 리팩토링

### 1. TaskDetailPopup 컴포넌트 분해 (657줄 → 모듈화)

#### 분해 전
- `TaskDetailPopup.tsx` (657줄) - 모든 기능이 하나의 파일에 집중

#### 분해 후

```
components/gantt/popup/
├── PopupHeader.tsx           # 팝업 헤더 (편집/삭제 버튼)
├── TaskInfoDisplay.tsx       # 작업 정보 표시
└── TaskEditForm.tsx          # 편집 폼

hooks/popup/
├── usePopupPosition.ts       # 팝업 위치 관리
├── useDragHandler.ts         # 드래그 기능
└── useTaskApi.ts            # API 호출 로직

components/gantt/
└── TaskDetailPopupRefactored.tsx  # 리팩토링된 메인 컴포넌트
```

#### 개선 효과
- **책임 분리**: 각 파일이 하나의 명확한 책임만 담당
- **재사용성**: 팝업 관련 훅들을 다른 팝업에서도 활용 가능
- **테스트 용이성**: 각 모듈을 독립적으로 테스트 가능
- **유지보수성**: 특정 기능 수정시 해당 파일만 수정하면 됨

### 2. UsageGuide 컴포넌트 분해 (483줄 → 모듈화)

#### 분해 전 (UsageGuide)
- `UsageGuide.tsx` (483줄) - 모든 가이드 내용이 하나의 파일에 집중

#### 분해 후 (UsageGuideModular)

```
components/guide/sections/
├── FeatureCardComponent.tsx  # 기능 카드 컴포넌트
├── QuickStartSection.tsx     # 빠른 시작 섹션
├── HelpTipsSection.tsx       # 도움말 및 팁 섹션
└── featureCardsData.ts       # 기능 카드 데이터

components/
└── UsageGuideModular.tsx     # 리팩토링된 메인 컴포넌트
```

#### 개선 효과
- **컨텐츠 관리 용이성**: 각 섹션을 독립적으로 관리
- **데이터 분리**: 하드코딩된 데이터를 별도 파일로 분리
- **확장성**: 새로운 섹션 추가가 쉬워짐

### 3. ClientHome 컴포넌트 분해 (262줄 → 모듈화)

#### 분해 전 (ClientHome)
- `ClientHome.tsx` (262줄) - 메인 페이지 로직이 하나의 파일에 집중

#### 분해 후 (ClientHomeRefactored)

```
components/home/sections/
├── DashboardSection.tsx      # 대시보드 섹션
└── GanttChartSection.tsx     # 간트차트 섹션

hooks/data/
└── useTaskManager.ts         # 작업 관리 로직

components/home/
└── ClientHomeRefactored.tsx  # 리팩토링된 메인 컴포넌트
```

#### 개선 효과
- **섹션별 분리**: 대시보드와 간트차트 영역을 독립적으로 관리
- **로직 분리**: 작업 추가/수정/삭제 로직을 별도 훅으로 분리
- **상태 관리 최적화**: 각 섹션별 상태를 독립적으로 관리
- **재사용성**: 섹션 컴포넌트들을 다른 페이지에서도 활용 가능

### 4. 인덱스 파일 정리

#### hooks/index.ts
- 모든 훅들을 카테고리별로 정리
- 새로운 popup 관련 훅들 추가
- useTaskManager 훅 추가

#### components/index.ts
- 주요 컴포넌트들을 카테고리별로 정리
- 리팩토링된 컴포넌트들 추가
- 홈 섹션 컴포넌트들 추가

## 사용법

### 리팩토링된 TaskDetailPopup 사용
```tsx
import { TaskDetailPopupRefactored } from '../components'

// 기존과 동일한 props 사용
<TaskDetailPopupRefactored
  task={task}
  position={position}
  onClose={onClose}
  onTaskUpdate={onTaskUpdate}
  onDataRefresh={onDataRefresh}
  onTaskDelete={onTaskDelete}
/>
```

### 리팩토링된 UsageGuide 사용
```tsx
import { UsageGuideModular } from '../components'

// props 없이 사용
<UsageGuideModular />
```

### 개별 훅 사용
```tsx
import { usePopupPosition, useDragHandler, useTaskApi } from '../hooks'

const MyPopup = () => {
  const { currentPosition, updatePosition } = usePopupPosition({
    initialPosition: { x: 100, y: 100 },
    popupRef
  })
  
  const { handleMouseDown } = useDragHandler({
    onPositionChange: updatePosition
  })
  
  const { isLoading, saveTask } = useTaskApi({
    onTaskUpdate,
    onDataRefresh
  })
  
  // ...
}
```

## 다음 단계 계획

### 1. ClientHome 컴포넌트 리팩토링 (262줄)
- 대시보드 섹션 분리
- 상태 관리 로직 분리
- 이벤트 핸들러 모듈화

### 2. GanttChart 관련 컴포넌트들 리팩토링
- GanttHeader.tsx (9KB)
- CustomGanttChart.tsx (9KB)
- useCustomGanttChart.ts (9KB)

### 3. 공통 유틸리티 및 타입 정리
- 타입 정의 모듈화
- 공통 상수 분리
- 유틸리티 함수 정리

## 리팩토링 가이드라인

### 파일 크기
- **5KB 이상**: 리팩토링 후보
- **10KB 이상**: 우선 리팩토링 대상

### 책임 분리 원칙
1. **단일 책임 원칙**: 각 컴포넌트/훅은 하나의 명확한 책임만 담당
2. **의존성 역전**: 구체적인 구현보다는 추상화에 의존
3. **개방-폐쇄 원칙**: 확장에는 열려있고 수정에는 닫혀있는 구조

### 폴더 구조
```
components/
├── [component-name]/
│   ├── sections/           # 섹션별 하위 컴포넌트
│   ├── [ComponentName].tsx # 메인 컴포넌트
│   └── index.ts           # 내보내기 정리

hooks/
├── [category]/            # 카테고리별 훅 그룹
│   ├── useXxx.ts
│   └── useYyy.ts
└── index.ts              # 전체 훅 내보내기
```

## 변경 이력

- **2025-01-07**: TaskDetailPopup, UsageGuide 컴포넌트 리팩토링 완료
- **2025-01-07**: 인덱스 파일 정리 및 문서화 완료
- **2025-01-07**: UsageGuide 컴포넌트 대형 리팩토링 (23KB → 1.6KB + 8개 섹션 분리)
  - GuideHeader: 헤더 UI 분리 (1.4KB)
  - SystemOverviewSection: 시스템 개요 (2.5KB)
  - ExcelUploadGuideSection: Excel 업로드 가이드 (2.2KB)
  - GanttChartGuideSection: Gantt 차트 활용법 (2.2KB)
  - TaskEditGuideSection: 작업 편집 가이드 (2.2KB)
  - ActionItemsGuideSection: Action Items 사용법 (1.9KB)
  - ResourceStatsGuideSection: 담당자별 현황 및 통계 (3.3KB)
  - TroubleshootingSection: 문제 해결 (2.1KB)

## 리팩토링 성과 요약

### 대형 컴포넌트 리팩토링 현황

- **TaskDetailPopup**: 27KB (671라인) - 이미 리팩토링됨
- **UsageGuide**: 23KB (469라인) → 1.6KB (47라인) + 8개 섹션 컴포넌트로 분리 ✅
- **AddActionItemPopup**: 11KB (296라인) - 리팩토링 예정
- **GanttHeader**: 9.7KB (289라인) - 리팩토링 예정  
- **CustomGanttChart**: 9.5KB (268라인) - 리팩토링 예정
- **ClientHome**: 9.3KB (252라인) - 이미 리팩토링됨

### Utils 리팩토링 현황

- **canvas/legacy.ts**: 12KB (354라인) - 리팩토링 예정
- **canvas/gantt.ts**: 9.8KB (302라인) - 리팩토링 예정
- **tree/builder.ts**: 5.3KB (133라인) - 적정 크기

### Hooks 리팩토링 현황

- **useCustomGanttChart.ts**: 9.6KB (264라인) - 리팩토링 예정
- **popup/useTaskApi.ts**: 6.3KB (169라인) - 리팩토링 예정
- **useGanttChart.ts**: 5.4KB (158라인) - 적정 크기

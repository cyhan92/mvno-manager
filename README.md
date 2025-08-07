# MVNO Manager

> **v2.0** - 통합 프로젝트 관리 시스템 with 고급 간트 차트

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.53.0-green?logo=supabase)
![Material-UI](https://img.shields.io/badge/Material--UI-7.3.0-blue?logo=mui)

## 📋 프로젝트 개요

**MVNO Manager**는 Next.js 15와 React 19 기반의 현대적인 프로젝트 관리 시스템입니다. 특히 MVNO(Mobile Virtual Network Operator) 사업 관련 업무를 체계적으로 관리할 수 있도록 설계되었으며, 고도로 커스터마이징된 간트 차트를 통해 시각적인 프로젝트 관리를 제공합니다.

### 🎯 주요 특징

- **🎨 Custom Gantt Chart**: Canvas 기반 고성능 간트 차트
- **📊 실시간 대시보드**: 프로젝트 진행률 및 리스크 분석
- **🗂️ 계층적 Task 관리**: 대분류 > 중분류 > 소분류 > 세부업무
- **👥 담당자 관리**: 부서별, 담당자별 업무 현황 추적
- **💾 Supabase 통합**: 실시간 데이터베이스 연동
- **📱 반응형 디자인**: 모바일부터 데스크톱까지 최적화

## 🚀 최신 업데이트 (v2.0)

### ✨ 새로운 기능
- **중분류/소분류 추가**: 소분류 우클릭으로 새로운 분류 및 Task 생성
- **대분류 일괄 수정**: 대분류명 변경시 하위 모든 Task 자동 업데이트
- **고유 ID 생성 시스템**: 타임스탬프 기반 중복 방지 ID 생성
- **향상된 컨텍스트 메뉴**: 직관적인 우클릭 메뉴 시스템

### 🔧 대규모 리팩토링
- **모듈화된 아키텍처**: 600+ 줄 컴포넌트를 10-50줄 단위로 분해
- **재사용 가능한 훅**: 비즈니스 로직과 UI 로직 완전 분리
- **타입 안전성 강화**: TypeScript 활용도 극대화
- **성능 최적화**: Canvas 렌더링 및 메모리 사용량 개선

## 🏗️ 프로젝트 구조

```
mvno-manager/
├── 📁 app/                          # Next.js App Router
│   ├── api/                         # API Routes
│   │   ├── tasks-db/               # Task CRUD API
│   │   ├── major-category/         # 대분류 관리 API
│   │   └── sub-category/           # 중분류/소분류 관리 API
│   ├── layout.tsx                  # 전역 레이아웃
│   └── page.tsx                    # 메인 페이지
│
├── 📁 components/                   # React 컴포넌트
│   ├── gantt/                      # 간트 차트 관련 컴포넌트
│   │   ├── CustomGanttChartModular.tsx     # 모듈화된 간트 차트
│   │   ├── ActionItemList.tsx              # 좌측 액션 아이템 목록
│   │   ├── TaskDetailPopupRefactored.tsx   # 리팩토링된 Task 상세 팝업
│   │   ├── SubCategoryEditPopup.tsx        # 중분류/소분류 편집 팝업
│   │   └── popup/                          # 팝업 관련 서브 컴포넌트
│   │       └── fields/                     # 재사용 가능한 폼 필드들
│   ├── home/                       # 홈 화면 관련 컴포넌트
│   │   └── sections/               # 대시보드 섹션들
│   └── guide/                      # 사용 가이드 컴포넌트
│
├── 📁 hooks/                       # Custom React Hooks
│   ├── chart/                      # 차트 관련 훅
│   ├── data/                       # 데이터 관리 훅
│   ├── gantt/                      # 간트 관련 훅
│   └── popup/                      # 팝업 관련 훅
│
├── 📁 utils/                       # 유틸리티 함수
│   ├── canvas/                     # Canvas 렌더링 유틸
│   └── gantt/                      # 간트 관련 유틸
│
├── 📁 types/                       # TypeScript 타입 정의
├── 📁 contexts/                    # React Context
├── 📁 lib/                         # 외부 라이브러리 설정
└── 📁 styles/                      # 스타일 관련 파일
```

## 🛠️ 기술 스택

### Frontend
- **Framework**: [Next.js 15.4.5](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.1.0](https://react.dev/)
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) + [Material-UI 7.3.0](https://mui.com/)
- **Icons**: [Lucide React](https://lucide.dev/) + [MUI Icons](https://mui.com/material-ui/material-icons/)

### Backend & Database
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes
- **Real-time**: Supabase Realtime

### Development Tools
- **Build Tool**: [Turbopack](https://turbo.build/pack) (Next.js 15 기본)
- **Package Manager**: npm
- **Code Quality**: ESLint + TypeScript
- **Version Control**: Git

### Data Processing
- **Excel Processing**: [ExcelJS](https://github.com/exceljs/exceljs), [XLSX](https://sheetjs.com/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## 🎨 주요 기능

### 1. 🗂️ 계층적 Task 관리
```typescript
// Task 계층 구조
interface Task {
  level: 0 | 1 | 2;  // 0: 대분류, 1: 소분류, 2: 세부업무
  majorCategory: string;    // 대분류 (예: "B2_SKT 사업협력")
  middleCategory: string;   // 중분류 (예: "계약체결")
  minorCategory: string;    // 소분류 (예: "도매계약")
  parentId?: string;        // 부모 Task ID
  hasChildren: boolean;     // 하위 Task 존재 여부
}
```

### 2. 🎯 고급 간트 차트
- **Canvas 기반 렌더링**: 고성능 시각화
- **실시간 업데이트**: Supabase Realtime 연동
- **인터랙티브 UI**: 드래그, 클릭, 컨텍스트 메뉴
- **다중 뷰 모드**: 주별/월별 보기, 그룹핑 옵션

### 3. 📊 대시보드 & 분석
- **진행률 통계**: 전체/부서별/담당자별 진행률
- **리스크 분석**: 지연 예상 Task 자동 감지
- **담당자 현황**: 업무 부하 분석 및 시각화

### 4. 🔧 관리자 기능
- **일괄 수정**: 대분류명 변경시 하위 모든 Task 업데이트
- **Excel 연동**: 기존 Excel 데이터 import/export
- **권한 관리**: Supabase Auth 기반 접근 제어

## 🚀 시작하기

### 1. 사전 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn
- Supabase 계정 (데이터베이스 설정용)

### 2. 설치 및 설정

```bash
# 저장소 클론
git clone https://github.com/cyhan92/mvno-manager.git
cd mvno-manager

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 Supabase 정보 입력
```

### 3. 환경 변수 설정

`.env.local` 파일에 다음 정보를 입력하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. 데이터베이스 설정

Supabase에서 제공하는 SQL을 실행하세요:

```bash
# Supabase SQL 에디터에서 실행
cat SUPABASE_SETUP.sql
```

### 5. 개발 서버 실행

```bash
# 개발 서버 시작 (Turbopack 사용)
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 6. 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start
```

## 📚 React & Next.js 학습 가이드

이 프로젝트는 **React 19**와 **Next.js 15**의 최신 기능들을 활용한 실무 예제입니다. 다음과 같은 개념들을 학습할 수 있습니다:

### 🔰 React 19 핵심 개념

#### 1. **함수형 컴포넌트 & Hooks**
```typescript
// 커스텀 훅 예제 (hooks/data/useTaskManager.ts)
export const useTaskManager = ({ tasks, setTasks, refetch }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleTaskAdd = useCallback(async (newTask) => {
    // Task 추가 로직
  }, [tasks, refetch])
  
  return { isLoading, handleTaskAdd, /* ... */ }
}
```

#### 2. **Context API 활용**
```typescript
// contexts/AuthContext.tsx
export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

#### 3. **고급 상태 관리**
- `useState`, `useEffect`, `useCallback`, `useMemo`
- 복잡한 상태 로직을 커스텀 훅으로 분리
- 상태 최적화 및 메모이제이션

#### 4. **컴포넌트 설계 패턴**
```typescript
// 컴포넌트 합성 패턴
<TaskDetailPopup>
  <TaskEditForm>
    <CategoryEditor />
    <DateRangeFields />
    <ProgressSliderField />
  </TaskEditForm>
</TaskDetailPopup>
```

### 🚀 Next.js 15 핵심 개념

#### 1. **App Router (13+)**
```typescript
// app/layout.tsx - 루트 레이아웃
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

// app/page.tsx - 메인 페이지
export default function Home() {
  return <ClientHome />
}
```

#### 2. **API Routes**
```typescript
// app/api/tasks-db/route.ts
export async function POST(request: Request) {
  const taskData = await request.json()
  // Task 생성 로직
  return NextResponse.json({ success: true })
}
```

#### 3. **Server & Client Components**
```typescript
// 서버 컴포넌트 (기본값)
export default function ServerComponent() {
  // 서버에서 실행
  return <div>Server Component</div>
}

// 클라이언트 컴포넌트
'use client'
export default function ClientComponent() {
  // 브라우저에서 실행
  const [state, setState] = useState()
  return <div>Client Component</div>
}
```

#### 4. **Dynamic Imports & Code Splitting**
```typescript
// 동적 import로 코드 분할
const ClientHome = dynamic(() => import('../components/home/ClientHomeRefactored'), {
  ssr: false,
  loading: () => <Loading />
})
```

#### 5. **Turbopack 최적화**
- Next.js 15의 새로운 번들러
- 빠른 개발 서버 시작
- 증분 컴파일 지원

### 🎯 TypeScript 고급 활용

#### 1. **타입 안전성**
```typescript
// types/task.ts
export interface Task {
  id: string
  name: string
  start: Date
  end: Date
  // ... 기타 필드
}

// 제네릭 활용
interface UseTaskManagerProps {
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  refetch?: () => void
}
```

#### 2. **유니온 타입 & 리터럴 타입**
```typescript
export type ViewMode = 'overview' | 'detailed'
export type GroupBy = 'resource' | 'action' | 'major'
export type DateUnit = 'week' | 'month'
```

#### 3. **고급 타입 조작**
```typescript
// 조건부 타입, 매핑된 타입 등 활용
type TaskUpdate<T> = Partial<Pick<Task, keyof T>>
```

### 🎨 스타일링 학습

#### 1. **Tailwind CSS**
```tsx
// 유틸리티 클래스 활용
<button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
  클릭하세요
</button>
```

#### 2. **Material-UI (MUI)**
```tsx
// MUI 컴포넌트 활용
<Paper elevation={2} sx={{ p: 2 }}>
  <Typography variant="h5" gutterBottom>
    제목
  </Typography>
</Paper>
```

#### 3. **CSS-in-JS (Emotion)**
```typescript
// MUI와 함께 사용되는 Emotion
const StyledComponent = styled.div`
  color: ${props => props.theme.palette.primary.main};
`
```

### 🔧 고급 패턴 학습

#### 1. **컴포넌트 합성 (Composition)**
```typescript
// 작은 컴포넌트들을 조합하여 큰 기능 구현
<TaskForm>
  <CategoryFields />
  <DateRangeFields />
  <ResourceFields />
</TaskForm>
```

#### 2. **Render Props & Higher-Order Components**
```typescript
// 로직 재사용을 위한 패턴들
const withLoading = (Component) => (props) => {
  if (props.isLoading) return <Loading />
  return <Component {...props} />
}
```

#### 3. **Error Boundaries**
```typescript
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) return <ErrorFallback />
    return this.props.children
  }
}
```

### 📊 상태 관리 패턴

#### 1. **Local State vs Global State**
- `useState`: 컴포넌트 로컬 상태
- `useContext`: 전역 상태 공유
- 커스텀 훅: 로직 재사용

#### 2. **비동기 상태 관리**
```typescript
const useAsyncTask = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const execute = useCallback(async (asyncFunction) => {
    try {
      setLoading(true)
      setError(null)
      const result = await asyncFunction()
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])
  
  return { loading, error, execute }
}
```

### 🚀 성능 최적화

#### 1. **React.memo & useMemo**
```typescript
// 컴포넌트 메모이제이션
const TaskItem = React.memo(({ task, onUpdate }) => {
  return <div>{task.name}</div>
})

// 값 메모이제이션
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])
```

#### 2. **useCallback 최적화**
```typescript
// 함수 메모이제이션으로 리렌더링 방지
const handleClick = useCallback((id) => {
  onTaskUpdate(id)
}, [onTaskUpdate])
```

#### 3. **Code Splitting**
```typescript
// 지연 로딩으로 초기 번들 크기 감소
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

## 🔍 프로젝트에서 학습할 수 있는 실무 패턴

### 1. **모듈화 아키텍처**
- 큰 컴포넌트를 작은 단위로 분해하는 방법
- 재사용 가능한 컴포넌트 설계
- 관심사 분리 (Separation of Concerns)

### 2. **Custom Hooks 설계**
- 비즈니스 로직과 UI 로직 분리
- 상태 관리 로직 재사용
- API 호출 로직 추상화

### 3. **TypeScript 실무 활용**
- 복잡한 데이터 구조 타입 정의
- 제네릭을 활용한 재사용 가능한 컴포넌트
- 타입 가드와 타입 추론

### 4. **Canvas API 활용**
- 고성능 그래픽 렌더링
- 실시간 상호작용 구현
- 커스텀 차트 라이브러리 개발

### 5. **데이터베이스 통합**
- Supabase 실시간 기능 활용
- CRUD 작업 최적화
- 관계형 데이터 모델링

## 📖 학습 순서 추천

### 초급자 (React 기초)
1. **기본 컴포넌트 구조 파악**: `components/Loading.tsx`, `components/Header.tsx`
2. **Props와 State 이해**: `components/gantt/ActionItemList.tsx`
3. **이벤트 핸들링**: 클릭, 폼 제출 등
4. **조건부 렌더링**: 로딩 상태, 에러 상태 처리

### 중급자 (React + Next.js)
1. **커스텀 훅 분석**: `hooks/data/useTaskManager.ts`
2. **Context API 활용**: `contexts/AuthContext.tsx`
3. **API 연동**: `app/api/` 폴더의 API Routes
4. **상태 관리 패턴**: 복잡한 상태 로직 분석

### 고급자 (아키텍처 & 최적화)
1. **컴포넌트 리팩토링**: TaskDetailPopup의 모듈화 과정
2. **성능 최적화**: 메모이제이션, 지연 로딩
3. **Canvas API**: 간트 차트 렌더링 로직
4. **TypeScript 고급**: 복잡한 타입 정의와 제네릭

## 🤝 기여하기

이 프로젝트는 학습 목적으로 지속적으로 개선되고 있습니다. 기여를 원하시는 분들은:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 연락처

- **개발자**: cyhan92
- **GitHub**: [cyhan92/mvno-manager](https://github.com/cyhan92/mvno-manager)
- **이슈 트래킹**: [GitHub Issues](https://github.com/cyhan92/mvno-manager/issues)

---

⭐ **이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!**

> 이 README는 프로젝트의 지속적인 발전과 함께 업데이트됩니다.

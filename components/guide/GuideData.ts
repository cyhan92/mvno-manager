export const featureCards = [
  {
    iconType: 'CloudUpload',
    title: 'Excel → DB',
    description: 'Excel 파일을 업로드하여 데이터베이스에 저장',
    color: 'primary' as const
  },
  {
    iconType: 'TableChart',
    title: 'Gantt Chart',
    description: '프로젝트 일정을 시각적으로 관리',
    color: 'success' as const
  },
  {
    iconType: 'Edit',
    title: 'Action Item',
    description: '작업 항목 추가, 수정, 삭제',
    color: 'warning' as const
  },
  {
    iconType: 'People',
    title: 'Resource',
    description: '담당자별 작업 현황 확인',
    color: 'info' as const
  },
  {
    iconType: 'Assignment',
    title: 'Progress',
    description: '프로젝트 진행률 추적',
    color: 'secondary' as const
  },
  {
    iconType: 'Warning',
    title: 'Alert',
    description: '중요 이슈 및 알림 관리',
    color: 'error' as const
  }
]

export const quickStartSteps = [
  {
    iconType: 'CloudUpload',
    title: "1. Excel 파일 업로드",
    description: "프로젝트 데이터가 포함된 Excel 파일을 업로드하세요.",
    details: [
      "파일 형식: .xlsx, .xls",
      "필수 컬럼: 작업명, 시작일, 종료일, 담당자",
      "선택 컬럼: 진행률, 우선순위, 설명"
    ]
  },
  {
    iconType: 'Storage',
    title: "2. 데이터베이스 동기화",
    description: "업로드된 데이터가 자동으로 데이터베이스에 저장됩니다.",
    details: [
      "실시간 데이터 동기화",
      "자동 백업 및 버전 관리",
      "데이터 무결성 검증"
    ]
  },
  {
    iconType: 'TableChart',
    title: "3. Gantt Chart 확인",
    description: "업로드된 프로젝트를 Gantt Chart로 시각화합니다.",
    details: [
      "일정별 작업 진행률 표시",
      "담당자별 색상 구분",
      "마일스톤 및 의존성 표시"
    ]
  },
  {
    iconType: 'Edit',
    title: "4. Action Item 관리",
    description: "필요시 작업 항목을 추가, 수정, 삭제할 수 있습니다.",
    details: [
      "실시간 작업 상태 업데이트",
      "담당자 변경 및 일정 조정",
      "진행률 수동 업데이트"
    ]
  }
]

export const featureDetails = [
  {
    category: "데이터 관리",
    iconType: 'Storage',
    features: [
      {
        name: "Excel 업로드",
        description: "Excel 파일을 직접 업로드하여 프로젝트 데이터를 가져올 수 있습니다.",
        benefits: ["빠른 데이터 입력", "기존 Excel 파일 활용", "일괄 데이터 처리"]
      },
      {
        name: "데이터베이스 동기화",
        description: "업로드된 데이터는 실시간으로 데이터베이스와 동기화됩니다.",
        benefits: ["실시간 업데이트", "데이터 무결성 보장", "자동 백업"]
      },
      {
        name: "데이터 검증",
        description: "업로드된 데이터의 형식과 내용을 자동으로 검증합니다.",
        benefits: ["오류 사전 방지", "데이터 품질 향상", "사용자 가이드 제공"]
      }
    ]
  },
  {
    category: "프로젝트 시각화",
    iconType: 'TableChart',
    features: [
      {
        name: "Gantt Chart",
        description: "프로젝트 일정을 시각적으로 표현하는 간트차트를 제공합니다.",
        benefits: ["직관적인 일정 관리", "진행률 시각화", "의존성 표시"]
      },
      {
        name: "담당자별 뷰",
        description: "담당자별로 작업을 필터링하여 볼 수 있습니다.",
        benefits: ["개인별 업무 현황", "업무 분산 확인", "리소스 관리"]
      },
      {
        name: "진행률 추적",
        description: "각 작업의 진행률을 실시간으로 추적할 수 있습니다.",
        benefits: ["프로젝트 현황 파악", "지연 작업 식별", "성과 측정"]
      }
    ]
  },
  {
    category: "작업 관리",
    iconType: 'Assignment',
    features: [
      {
        name: "Action Item 추가/수정/삭제",
        description: "새로운 작업을 추가하거나 기존 작업을 수정/삭제할 수 있습니다.",
        benefits: ["유연한 프로젝트 관리", "실시간 업데이트", "팀 협업 지원"]
      },
      {
        name: "일정 조정",
        description: "작업의 시작일과 종료일을 쉽게 조정할 수 있습니다.",
        benefits: ["빠른 일정 변경", "자동 의존성 업데이트", "충돌 방지"]
      },
      {
        name: "우선순위 관리",
        description: "작업의 우선순위를 설정하고 관리할 수 있습니다.",
        benefits: ["중요 작업 식별", "리소스 최적화", "효율적 업무 배분"]
      }
    ]
  }
]

export const tips = [
  {
    iconType: 'Lightbulb',
    title: "Excel 파일 준비 팁",
    content: [
      "첫 번째 행은 헤더로 사용됩니다",
      "날짜 형식은 YYYY-MM-DD 또는 MM/DD/YYYY를 권장합니다",
      "담당자명은 일관성 있게 입력해주세요",
      "빈 행이나 셀은 자동으로 제외됩니다"
    ]
  },
  {
    iconType: 'Schedule',
    title: "효과적인 일정 관리",
    content: [
      "마일스톤을 설정하여 주요 목표를 표시하세요",
      "작업 간 의존성을 명확히 정의하세요",
      "여유 시간을 고려하여 일정을 계획하세요",
      "정기적으로 진행률을 업데이트하세요"
    ]
  },
  {
    iconType: 'TrendingUp',
    title: "성과 향상 방법",
    content: [
      "주간/월간 진행률 리포트를 활용하세요",
      "지연되는 작업을 사전에 식별하세요",
      "팀원별 업무량을 균등하게 분배하세요",
      "정기적인 프로젝트 회의를 진행하세요"
    ]
  }
]

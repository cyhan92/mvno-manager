export interface FeatureCardData {
  iconName: string
  title: string
  description: string
  color: 'primary' | 'success' | 'info' | 'warning' | 'secondary' | 'error'
}

export const featureCardsData: FeatureCardData[] = [
  {
    iconName: 'CloudUpload',
    title: 'Excel → DB',
    description: 'Excel 파일을 업로드하여 데이터베이스에 저장',
    color: 'primary'
  },
  {
    iconName: 'TableChart',
    title: 'Gantt 차트',
    description: '월별/주별 보기, 우클릭 메뉴로 Action Item 관리 (v2.2)',
    color: 'success'
  },
  {
    iconName: 'Assignment',
    title: 'Action Items 관리',
    description: '우클릭으로 상세업무 추가/편집, 부분 리프레시 지원 (v2.2)',
    color: 'info'
  },
  {
    iconName: 'Edit',
    title: '작업 편집',
    description: '작업 상세 정보 편집, 자동 기본값 설정 "미정" (v2.2)',
    color: 'warning'
  },
  {
    iconName: 'People',
    title: '담당자별 현황',
    description: '담당자별 업무 현황 및 세부 업무 더블클릭',
    color: 'secondary'
  },
  {
    iconName: 'TrendingUp',
    title: '통계 대시보드',
    description: '프로젝트 진행률, 스마트 동기화로 실시간 반영 (v2.2)',
    color: 'error'
  }
]

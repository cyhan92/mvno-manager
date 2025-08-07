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
    description: '월별/주별 보기, 트리 확장/축소 제어',
    color: 'success'
  },
  {
    iconName: 'Assignment',
    title: 'Action Items',
    description: '작업 목록 트리 구조 및 단계별 확장/축소',
    color: 'info'
  },
  {
    iconName: 'Edit',
    title: '작업 편집',
    description: '작업 상세 정보 및 부서 정보 편집',
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
    description: '프로젝트 진행률, 진행률 외부 표시 개선',
    color: 'error'
  }
]

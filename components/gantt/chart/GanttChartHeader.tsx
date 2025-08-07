import { DateUnit } from '../../../types/task'

interface GanttChartHeaderProps {
  flattenedTasksLength: number
  dateUnit: DateUnit
}

const GanttChartHeader = ({ flattenedTasksLength, dateUnit }: GanttChartHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          📊 프로젝트 간트 차트
        </h3>
        <p className="text-xs text-gray-700 font-bold mt-1">
          A: 재무&정산, B: 사업&기획, C: 고객관련, D: 개발&연동, O: Beta오픈, S: 정보보안&법무
        </p>
      </div>
      <div className="text-sm text-gray-600">
        총 {flattenedTasksLength}개 항목 (펼쳐진 항목)
        {dateUnit === 'week' && ' | 📆 주별 보기 (하단 스크롤로 이동)'}
        {dateUnit === 'month' && ' | 🗓️ 월별 보기'}
      </div>
    </div>
  )
}

export default GanttChartHeader

'use client'
import React, { useState } from 'react'

const UsageGuide: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          📖 사용 가이드
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {isExpanded ? '📤 접기' : '📥 펼치기'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* 시스템 개요 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">� 시스템 개요</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>스노우모바일 MVNO 프로젝트 관리 시스템</strong></p>
              <p>• Excel 파일을 업로드하여 프로젝트 작업을 관리하는 웹 기반 시스템</p>
              <p>• Gantt 차트를 통한 시각적 프로젝트 일정 관리</p>
              <p>• 담당자별 업무 현황 및 진행률 모니터링</p>
              <p>• 작업 상세 정보 편집 및 실시간 업데이트</p>
            </div>
          </div>

          {/* 주요 기능 */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">⭐ 주요 기능</h4>
            <div className="text-sm text-green-700 space-y-2">
              <div>
                <strong>📁 Excel → DB</strong>: Excel 파일을 업로드하여 데이터베이스에 저장
              </div>
              <div>
                <strong>📊 Gantt 차트</strong>: 프로젝트 일정을 시각적으로 표시
              </div>
              <div>
                <strong>📋 Action Items</strong>: 작업 목록을 트리 구조로 관리
              </div>
              <div>
                <strong>✏️ 작업 편집</strong>: 작업 상세 정보를 팝업에서 직접 편집
              </div>
              <div>
                <strong>👥 담당자별 현황</strong>: 담당자별 업무 할당 및 진행 상황 확인
              </div>
              <div>
                <strong>📈 통계 대시보드</strong>: 프로젝트 전체 진행률 및 리스크 분석
              </div>
            </div>
          </div>

          {/* Excel 파일 업로드 가이드 */}
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">📁 Excel 파일 업로드</h4>
            <div className="text-sm text-purple-700 space-y-2">
              <p><strong>1단계</strong>: 상단의 <span className="bg-green-100 px-2 py-1 rounded">📁 Excel → DB</span> 버튼 클릭</p>
              <p><strong>2단계</strong>: 파일 선택 다이얼로그에서 Excel 파일(.xlsx, .xls) 선택</p>
              <p><strong>3단계</strong>: 경고 메시지 확인 후 "확인" 클릭</p>
              <p><strong>4단계</strong>: 업로드 완료 후 자동으로 페이지 새로고침</p>
              <div className="mt-2 p-2 bg-purple-100 rounded">
                <p className="font-medium text-purple-800">⚠️ 주의: 기존 데이터베이스의 모든 데이터가 삭제되고 Excel 데이터로 교체됩니다!</p>
              </div>
            </div>
          </div>

          {/* Excel 파일 형식 */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">� Excel 파일 형식</h4>
            <div className="text-sm text-yellow-700">
              <p className="mb-2">Excel 파일의 첫 번째 행은 헤더이고, 다음 컬럼 순서를 지켜주세요:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><strong>A열</strong>: 작업명 (name)</div>
                <div><strong>B열</strong>: 상세 설명 (detail)</div>
                <div><strong>C열</strong>: 카테고리 (category)</div>
                <div><strong>D열</strong>: 부서 (department)</div>
                <div><strong>E열</strong>: 담당자 (resource)</div>
                <div><strong>F열</strong>: 시작일 (start_date)</div>
                <div><strong>G열</strong>: 종료일 (end_date)</div>
                <div><strong>H열</strong>: 진행률 (percent_complete)</div>
                <div><strong>I열</strong>: 상태 (status)</div>
                <div><strong>J열</strong>: 우선순위 (priority)</div>
              </div>
            </div>
          </div>

          {/* 작업 편집 가이드 */}
          <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
            <h4 className="font-semibold text-cyan-900 mb-2">✏️ 작업 편집 방법</h4>
            <div className="text-sm text-cyan-700 space-y-2">
              <p><strong>1단계</strong>: Gantt 차트에서 작업 바를 클릭하여 상세 정보 팝업 열기</p>
              <p><strong>2단계</strong>: 팝업에서 <span className="bg-blue-100 px-2 py-1 rounded">✏️ 편집</span> 버튼 클릭</p>
              <p><strong>3단계</strong>: 시작일, 종료일, 진행률, 담당자 수정</p>
              <p><strong>4단계</strong>: <span className="bg-blue-100 px-2 py-1 rounded">💾 저장</span> 버튼 클릭하여 데이터베이스에 반영</p>
              <p className="text-cyan-600">💡 변경 사항은 즉시 Gantt 차트와 통계에 반영됩니다.</p>
            </div>
          </div>

          {/* 담당자별 현황 */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">👥 담당자별 현황</h4>
            <div className="text-sm text-orange-700 space-y-2">
              <p><strong>담당자 카드 더블클릭</strong>: 해당 담당자의 세부 업무 목록 팝업 표시</p>
              <p><strong>업무 분류</strong>: 대분류 &gt; 소분류 &gt; 세부업무 계층 구조 (중분류는 데이터에만 포함)</p>
              <p><strong>완료 상태</strong>: ✅ 완료 (100%) / ⏳ 진행중 (100% 미만)</p>
              <p><strong>진행률 표시</strong>: 각 업무별 진행률 시각적 표시</p>
            </div>
          </div>

          {/* Action Items 사용법 */}
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <h4 className="font-semibold text-teal-900 mb-2">📋 Action Items 사용법</h4>
            <div className="text-sm text-teal-700 space-y-2">
              <p><strong>트리 확장/축소</strong>: 그룹 항목 클릭 시 하위 항목 표시/숨김</p>
              <p><strong>작업 선택</strong>: 개별 작업 클릭 시 해당 작업 선택</p>
              <p><strong>작업 상세보기</strong>: 작업 더블클릭 시 상세 정보 팝업</p>
              <p><strong>스크롤 동기화</strong>: Action Items와 Gantt 차트 스크롤 자동 동기화</p>
            </div>
          </div>

          {/* 주의사항 및 팁 */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-900 mb-2">⚠️ 주의사항 및 팁</h4>
            <div className="text-sm text-red-700 space-y-1">
              <p>• <strong>데이터 백업</strong>: Excel 업로드 전 기존 데이터를 백업하세요</p>
              <p>• <strong>파일 형식</strong>: .xlsx 또는 .xls 파일만 업로드 가능</p>
              <p>• <strong>날짜 형식</strong>: Excel 날짜 형식 사용 (자동 변환됨)</p>
              <p>• <strong>진행률</strong>: 0~1 사이 소수(0.8) 또는 0~100 정수(80) 모두 지원</p>
              <p>• <strong>빈 셀</strong>: 필수 필드(작업명)를 제외하고 빈 셀 허용</p>
              <p>• <strong>브라우저 호환성</strong>: Chrome, Firefox, Safari, Edge 지원</p>
            </div>
          </div>

          {/* 문제 해결 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🛠️ 문제 해결</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <div>
                <strong>업로드 실패</strong>: Excel 파일 형식과 데이터를 확인하고 다시 시도
              </div>
              <div>
                <strong>데이터가 표시되지 않음</strong>: 페이지 새로고침 또는 캐시 삭제
              </div>
              <div>
                <strong>편집이 저장되지 않음</strong>: 네트워크 연결 상태 확인 후 재시도
              </div>
              <div>
                <strong>Gantt 차트가 안 보임</strong>: 브라우저 개발자 도구에서 JavaScript 오류 확인
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsageGuide

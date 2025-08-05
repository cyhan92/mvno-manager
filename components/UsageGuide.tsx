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
          {/* 데이터 흐름 설명 */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🔄 데이터 흐름</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. <strong>Excel 파일</strong>: 프로젝트 루트의 Excel 파일에서 데이터 읽기</p>
              <p>2. <strong>데이터베이스 동기화</strong>: Excel 데이터를 Supabase 데이터베이스에 저장</p>
              <p>3. <strong>웹 표시</strong>: 데이터베이스에서 데이터를 읽어 웹페이지에 표시</p>
              <p>4. <strong>실시간 업데이트</strong>: Excel 변경 후 동기화하여 최신 데이터 반영</p>
            </div>
          </div>

          {/* 버튼 기능 설명 */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">🎯 버튼 기능</h4>
            <div className="text-sm text-green-700 space-y-2">
              <div>
                <strong>🔍 상태 확인</strong>: Excel 파일과 데이터베이스의 동기화 상태를 확인합니다.
              </div>
              <div>
                <strong>🔄 Excel → DB</strong>: Excel 파일의 데이터를 데이터베이스에 동기화합니다.
              </div>
              <div>
                <strong>📄 Excel 새로고침</strong>: 데이터베이스에서 최신 데이터를 다시 불러옵니다.
              </div>
            </div>
          </div>

          {/* Excel 파일 수정 가이드 */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">📝 Excel 파일 수정 시</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>1. Excel 파일에서 작업 내용을 수정합니다.</p>
              <p>2. <strong>🔄 Excel → DB</strong> 버튼을 클릭하여 데이터베이스에 동기화합니다.</p>
              <p>3. 웹페이지가 자동으로 새로고침되어 최신 데이터가 표시됩니다.</p>
              <p>4. 동기화 시 기존 데이터베이스 내용은 모두 Excel 데이터로 교체됩니다.</p>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-900 mb-2">⚠️ 주의사항</h4>
            <div className="text-sm text-red-700 space-y-1">
              <p>• <strong>파일 구조 변경 금지</strong>: Excel 파일의 컬럼 순서와 구조를 유지해주세요.</p>
              <p>• <strong>날짜 형식</strong>: Excel의 날짜 형식을 사용하세요 (시리얼 번호 자동 변환).</p>
              <p>• <strong>완료율</strong>: 0~1 사이의 소수로 입력하세요 (예: 0.8 = 80%).</p>
              <p>• <strong>완료여부</strong>: '완료', '진행중', '미완료' 중 하나로 입력하세요.</p>
              <p>• <strong>데이터 백업</strong>: 중요한 데이터는 별도로 백업해두세요.</p>
            </div>
          </div>

          {/* 트러블슈팅 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🛠️ 문제 해결</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <div>
                <strong>데이터베이스 연결 실패</strong>: 자동으로 Excel 파일 모드로 전환됩니다.
              </div>
              <div>
                <strong>동기화 실패</strong>: Excel 파일 형식과 데이터를 확인하고 다시 시도하세요.
              </div>
              <div>
                <strong>데이터가 표시되지 않음</strong>: 브라우저를 새로고침하거나 개발자 도구에서 오류를 확인하세요.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsageGuide

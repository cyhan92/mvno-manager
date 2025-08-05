'use client'
import React from 'react'
import { useTasksFromDatabase, useTaskAnalytics, useViewState } from '../hooks'
import Header from '../components/Header'
import StatsDashboard from '../components/StatsDashboard'
import RiskAnalysisComponent from '../components/RiskAnalysis'
import ResourceStatsComponent from '../components/ResourceStats'
import GanttChart from '../components/GanttChart'
import UsageGuide from '../components/UsageGuide'
import Loading from '../components/Loading'

export default function ClientHome() {
  const { tasks, loading, error, source, refetch } = useTasksFromDatabase()
  
  // tasks가 유효한 배열인지 확인
  const safeTasks = Array.isArray(tasks) ? tasks : []
  
  const { stats, resourceStats, riskAnalysis } = useTaskAnalytics(safeTasks)
  const { viewMode, groupBy, setViewMode, setGroupBy } = useViewState()

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">오류가 발생했습니다</div>
          <div className="text-gray-600 mb-4">{error}</div>
          {source === 'excel_fallback' && (
            <div className="text-yellow-600 mb-4">
              ⚠️ 데이터베이스 연결 실패로 Excel 파일을 사용 중입니다.
            </div>
          )}
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        taskCount={safeTasks.length}
        onRefresh={refetch}
        source={source}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <StatsDashboard stats={stats} />
        <RiskAnalysisComponent riskAnalysis={riskAnalysis} />
        <GanttChart 
          tasks={safeTasks}
          viewMode={viewMode}
          groupBy={groupBy}
          onViewModeChange={setViewMode}
          onGroupByChange={setGroupBy}
        />
        <ResourceStatsComponent resourceStats={resourceStats} />
        <UsageGuide />
      </div>
    </div>
  )
}

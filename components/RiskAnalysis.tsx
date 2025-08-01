import React from 'react'
import { RiskAnalysis } from '../types/task'

interface RiskAnalysisComponentProps {
  riskAnalysis: RiskAnalysis
}

const RiskAnalysisComponent: React.FC<RiskAnalysisComponentProps> = ({ riskAnalysis }) => {
  const { riskTasks, delayedTasks } = riskAnalysis

  if (riskTasks.length === 0 && delayedTasks.length === 0) {
    return null
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            ⚠️ 주의가 필요한 작업들
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskTasks.length > 0 && (
                <div>
                  <h4 className="font-medium">🚨 위험 작업 ({riskTasks.length}개) [진행율 &lt; 50% & 마감 7일 이내]</h4>
                  <ul className="mt-1 list-disc list-inside">
                    {riskTasks.slice(0, 3).map(task => (
                      <li key={task.id}>
                        {task.name} ({task.resource}) - {task.percentComplete.toFixed(2)}%
                      </li>
                    ))}
                    {riskTasks.length > 3 && <li>외 {riskTasks.length - 3}개 작업...</li>}
                  </ul>
                </div>
              )}
              {delayedTasks.length > 0 && (
                <div>
                  <h4 className="font-medium">⏰ 지연 작업 ({delayedTasks.length}개) [마감일 초과 & 미완료]</h4>
                  <ul className="mt-1 list-disc list-inside">
                    {delayedTasks.slice(0, 3).map(task => (
                      <li key={task.id}>
                        {task.name} ({task.resource}) - {task.percentComplete.toFixed(2)}%
                      </li>
                    ))}
                    {delayedTasks.length > 3 && <li>외 {delayedTasks.length - 3}개 작업...</li>}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RiskAnalysisComponent

'use client'
import React from 'react'
import { useTasksFromDatabase } from '../../hooks'

export default function TestPage() {
  console.log('🧪 테스트 페이지 렌더링')
  
  const { tasks, loading, error, source } = useTasksFromDatabase()
  
  console.log('🧪 테스트 데이터:', {
    tasks: tasks?.slice(0, 2),
    tasksLength: tasks?.length,
    loading,
    error,
    source
  })

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>데이터베이스 테스트 페이지</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>상태</h2>
        <p>로딩: {String(loading)}</p>
        <p>오류: {error || 'null'}</p>
        <p>소스: {source || 'null'}</p>
        <p>태스크 개수: {tasks?.length || 0}</p>
      </div>

      <div>
        <h2>첫 번째 태스크 (있다면)</h2>
        <pre>{JSON.stringify(tasks?.[0], null, 2)}</pre>
      </div>
    </div>
  )
}

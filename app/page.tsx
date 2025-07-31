'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Task } from '@/types/database'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error:', error)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  const updateProgress = async (id: string, progress: number) => {
    const status = progress === 100 ? '완료' : progress > 0 ? '진행중' : '미완료'
    
    const { error } = await supabase
      .from('tasks')
      .update({ progress, status })
      .eq('id', id)
    
    if (!error) {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, progress, status } : task
      ))
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">로딩 중...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            🚀 스노우모바일 MVNO 프로젝트 관리
          </h1>
          <p className="text-gray-600 mt-1">총 {tasks.length}개 작업</p>
        </div>
      </header>

      {/* 통계 카드 */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-green-900">완료</h3>
            <p className="text-3xl font-bold text-green-600">
              {tasks.filter(t => t.status === '완료').length}
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-blue-900">진행중</h3>
            <p className="text-3xl font-bold text-blue-600">
              {tasks.filter(t => t.status === '진행중').length}
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900">미완료</h3>
            <p className="text-3xl font-bold text-gray-600">
              {tasks.filter(t => t.status === '미완료').length}
            </p>
          </div>
        </div>

        {/* 작업 목록 */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                  <p className="text-gray-600 mt-1">
                    📂 {task.category} | 👤 {task.assignee}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === '완료' ? 'bg-green-100 text-green-800' :
                  task.status === '진행중' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
              
              {/* 진행률 바 */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700">진행률</span>
                  <span className="font-medium">{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
              
              {/* 진행률 업데이트 */}
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={task.progress}
                  onChange={(e) => updateProgress(task.id, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={task.progress}
                  onChange={(e) => updateProgress(task.id, parseInt(e.target.value))}
                  className="w-20 px-3 py-1 border rounded-md text-center"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
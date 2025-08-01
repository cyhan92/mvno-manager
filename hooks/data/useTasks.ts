import { useState, useEffect, useCallback } from 'react'
import { Task } from '../../types/task'
import { fetchAndTransformTasks } from '../../utils/task'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const tasks = await fetchAndTransformTasks()
      setTasks(tasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return { tasks, loading, error, refetch: fetchTasks }
}

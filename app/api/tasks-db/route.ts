import { NextResponse } from 'next/server'
import { getAllTasks, getTaskStats } from '../../../lib/database'

/**
 * 데이터베이스에서 모든 작업 조회
 */
export async function GET() {
  try {
    const tasks = await getAllTasks()
    const stats = await getTaskStats()
    
    return NextResponse.json({
      success: true,
      tasks,
      stats,
      source: 'database'
    })
    
  } catch (error) {
    console.error('데이터베이스 작업 조회 실패:', error)
    
    // 데이터베이스 오류 시 Excel 파일로 폴백
    try {
      const { getTasksFromXlsx } = await import('../../../lib/excel')
      const tasks = await getTasksFromXlsx()
      
      return NextResponse.json({
        success: true,
        tasks,
        stats: null,
        source: 'excel_fallback',
        warning: '데이터베이스 연결 실패로 Excel 파일을 사용했습니다.'
      })
      
    } catch (fallbackError) {
      return NextResponse.json({
        success: false,
        message: '데이터 조회에 실패했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        fallbackError: fallbackError instanceof Error ? fallbackError.message : '알 수 없는 오류'
      }, { status: 500 })
    }
  }
}

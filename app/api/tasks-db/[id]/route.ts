import { NextResponse } from 'next/server'
import { deleteTask } from '../../../../lib/database'

/**
 * 특정 작업 삭제
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const taskId = params.id
    
    if (!taskId) {
      return NextResponse.json({
        success: false,
        error: 'Task ID가 필요합니다.'
      }, { status: 400 })
    }

    // 데이터베이스에서 작업 삭제
    await deleteTask(taskId)
    
    return NextResponse.json({
      success: true,
      message: 'Task가 성공적으로 삭제되었습니다.'
    })
    
  } catch (error) {
    console.error('Task 삭제 실패:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      message: 'Task 삭제에 실패했습니다.'
    }, { status: 500 })
  }
}

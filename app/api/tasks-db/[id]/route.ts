import { NextResponse } from 'next/server'
import { deleteTask, updateTask } from '../../../../lib/database'

/**
 * 특정 작업 업데이트
 */
export async function PATCH(
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

    const body = await request.json()
    const { 
      name, 
      start, 
      end, 
      percent_complete, 
      resource, 
      department,
      major_category,
      middle_category,
      minor_category,
      status
    } = body

    // 데이터베이스에서 작업 업데이트
    const updatedTask = await updateTask(taskId, {
      name,
      start: start ? new Date(start) : undefined,
      end: end ? new Date(end) : undefined,
      percentComplete: percent_complete,
      resource,
      department,
      majorCategory: major_category,
      middleCategory: middle_category,
      minorCategory: minor_category,
      status
    })
    
    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: 'Task가 성공적으로 업데이트되었습니다.'
    })
    
  } catch (error) {
    console.error('Task 업데이트 실패:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      message: 'Task 업데이트에 실패했습니다.'
    }, { status: 500 })
  }
}

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

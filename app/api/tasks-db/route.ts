import { NextResponse } from 'next/server'
import { getAllTasks, getTaskStats, createTask } from '../../../lib/database'
import { Task } from '../../../types/task'
import { ExcelTask } from '../../../lib/excel/types'
import { createClient } from '@supabase/supabase-js'

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

/**
 * 새로운 작업 생성
 */
export async function POST(request: Request) {
  try {
    const taskData: Task = await request.json()
    
    console.log('🔍 받은 Task 데이터:', JSON.stringify(taskData, null, 2))
    
    // 입력 데이터 검증
    if (!taskData.id || !taskData.name) {
      console.error('❌ 필수 필드 누락:', { id: taskData.id, name: taskData.name })
      return NextResponse.json({
        success: false,
        error: '필수 필드가 누락되었습니다. (id, name)'
      }, { status: 400 })
    }
    
    // 날짜 변환 유틸리티 함수
    const parseDate = (dateValue: any): Date => {
      if (dateValue instanceof Date) {
        return dateValue
      }
      if (typeof dateValue === 'string') {
        const parsed = new Date(dateValue)
        return isNaN(parsed.getTime()) ? new Date() : parsed
      }
      return new Date()
    }
    
    // Task를 ExcelTask 형식으로 변환
    const excelTask: ExcelTask = {
      id: taskData.id,
      name: taskData.name,
      resource: taskData.resource || '',
      start: parseDate(taskData.start),
      end: parseDate(taskData.end),
      duration: taskData.duration || null,
      percentComplete: taskData.percentComplete || 0,
      dependencies: taskData.dependencies || null,
      category: taskData.category || taskData.majorCategory || '',
      subcategory: taskData.subcategory || taskData.middleCategory || '',
      detail: taskData.detail || taskData.name || '',
      department: taskData.department || '',
      status: (taskData.status && ['완료', '진행중', '미완료'].includes(taskData.status)) 
        ? taskData.status 
        : '미완료', // 유효하지 않은 status는 '미완료'로 기본 설정
      cost: taskData.cost || '',
      notes: taskData.notes || '',
      majorCategory: taskData.majorCategory || '',
      middleCategory: taskData.middleCategory || '',
      minorCategory: taskData.minorCategory || '',
      level: taskData.level || 2,
      parentId: taskData.parentId || '',
      hasChildren: taskData.hasChildren || false,
      isGroup: taskData.isGroup || false
    }
    
    console.log('🔍 변환된 ExcelTask 데이터:', JSON.stringify(excelTask, null, 2))
    
    // ID 중복 시 재시도 로직
    let createdDbTask
    let retryCount = 0
    const maxRetries = 3
    
    while (retryCount < maxRetries) {
      try {
        // 데이터베이스에 Task 생성
        createdDbTask = await createTask(excelTask)
        break // 성공하면 루프 탈출
      } catch (error) {
        if (error instanceof Error && error.message.includes('duplicate key value violates unique constraint')) {
          retryCount++
          if (retryCount < maxRetries) {
            // 새로운 고유 ID 생성
            const timestamp = Date.now()
            const randomStr = Math.random().toString(36).substr(2, 9)
            excelTask.id = `task_${timestamp}_${randomStr}_retry${retryCount}`
            console.log(`🔄 ID 중복으로 재시도 (${retryCount}/${maxRetries}):`, excelTask.id)
            continue
          }
        }
        throw error // 다른 오류이거나 최대 재시도 횟수 초과 시 오류 다시 발생
      }
    }

    // createdDbTask가 없으면 오류
    if (!createdDbTask) {
      throw new Error('작업 생성에 실패했습니다.')
    }
    
    // 생성된 DB Task를 다시 Task 형식으로 변환하여 반환
    const createdTask: Task = {
      id: excelTask.id,
      dbId: createdDbTask.id,
      name: excelTask.name,
      resource: excelTask.resource,
      start: excelTask.start,
      end: excelTask.end,
      duration: excelTask.duration,
      percentComplete: excelTask.percentComplete,
      dependencies: excelTask.dependencies,
      category: excelTask.category,
      subcategory: excelTask.subcategory,
      detail: excelTask.detail,
      department: excelTask.department,
      status: excelTask.status,
      cost: excelTask.cost,
      notes: excelTask.notes,
      majorCategory: excelTask.majorCategory,
      middleCategory: excelTask.middleCategory,
      minorCategory: excelTask.minorCategory,
      level: excelTask.level,
      parentId: excelTask.parentId,
      hasChildren: excelTask.hasChildren,
      isGroup: excelTask.isGroup
    }
    
    return NextResponse.json({
      success: true,
      task: createdTask,
      message: 'Task가 성공적으로 생성되었습니다.'
    })
    
  } catch (error) {
    console.error('Task 생성 실패:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      message: 'Task 생성에 실패했습니다.'
    }, { status: 500 })
  }
}

// Task 삭제 (DELETE)
export async function DELETE(request: Request) {
  try {
    console.log('🗑️ DELETE 요청 시작')
    
    // Supabase 클라이언트 초기화
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Service Role Key가 있으면 우선 사용, 없으면 Anon Key 사용
    const effectiveKey = supabaseServiceKey || supabaseAnonKey
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      usingServiceRole: !!supabaseServiceKey
    })
    
    if (!effectiveKey || !supabaseUrl) {
      console.error('❌ Supabase 환경변수가 설정되지 않았습니다.')
      return NextResponse.json({
        success: false,
        error: 'Supabase 환경변수가 설정되지 않았습니다.'
      }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, effectiveKey)
    
    // 요청 본문에서 삭제할 Task ID 추출
    const body = await request.json()
    const { id } = body
    
    if (!id) {
      console.error('❌ Task ID가 제공되지 않았습니다.')
      return NextResponse.json({
        success: false,
        error: 'Task ID가 필요합니다.'
      }, { status: 400 })
    }
    
    console.log('🔍 삭제할 Task ID:', id)
    
    // Supabase에서 Task 삭제 (task_id 필드로 삭제)
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('task_id', id)
    
    if (deleteError) {
      console.error('❌ Supabase 삭제 오류:', deleteError)
      return NextResponse.json({
        success: false,
        error: `데이터베이스 삭제 실패: ${deleteError.message}`
      }, { status: 500 })
    }
    
    console.log('✅ Task 삭제 성공:', id)
    
    return NextResponse.json({
      success: true,
      message: 'Task가 성공적으로 삭제되었습니다.',
      deletedId: id
    })
    
  } catch (error) {
    console.error('❌ Task 삭제 실패:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      message: 'Task 삭제에 실패했습니다.'
    }, { status: 500 })
  }
}

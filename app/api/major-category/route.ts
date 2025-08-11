import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * 대분류 추가 API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { majorCategory } = body

    console.log(`🚀 API 요청 수신: POST /api/major-category`)
    console.log(`📋 요청 데이터:`, { majorCategory })

    if (!majorCategory || !majorCategory.trim()) {
      console.error('❌ 필수 파라미터 누락:', { majorCategory })
      return NextResponse.json({
        success: false,
        error: '대분류명이 필요합니다.'
      }, { status: 400 })
    }

    const trimmedCategory = majorCategory.trim()

    // 기존에 동일한 대분류가 있는지 확인
    const { data: existingTasks, error: findError } = await supabase
      .from('tasks')
      .select('major_category')
      .eq('major_category', trimmedCategory)
      .limit(1)

    if (findError) {
      console.error('❌ 기존 대분류 조회 오류:', findError)
      return NextResponse.json({
        success: false,
        error: `기존 대분류 조회 실패: ${findError.message}`
      }, { status: 500 })
    }

    if (existingTasks && existingTasks.length > 0) {
      console.warn(`⚠️ 이미 존재하는 대분류: "${trimmedCategory}"`)
      return NextResponse.json({
        success: false,
        error: '이미 해당 대분류에 속한 Task가 존재합니다.'
      }, { status: 409 })
    }

    console.log(`🔄 새 대분류 추가 시작: "${trimmedCategory}"`)

    // 새로운 Task ID 생성 (기존 Task 중 가장 큰 번호 + 1)
    const { data: allTasks, error: allTasksError } = await supabase
      .from('tasks')
      .select('task_id')
      .order('task_id', { ascending: false })
      .limit(1)

    if (allTasksError) {
      console.error('❌ Task ID 조회 오류:', allTasksError)
      return NextResponse.json({
        success: false,
        error: `Task ID 조회 실패: ${allTasksError.message}`
      }, { status: 500 })
    }

    let nextId = 1
    if (allTasks && allTasks.length > 0) {
      const lastTaskId = allTasks[0].task_id
      const match = lastTaskId.match(/TASK-(\d+)/)
      if (match) {
        nextId = parseInt(match[1], 10) + 1
      }
    }

    const newTaskId = `TASK-${String(nextId).padStart(3, '0')}`

    // 새 대분류에 속하는 기본 Task 생성 (대분류/중분류/소분류/상세업무 구조)
    const newTask = {
      task_id: newTaskId,
      title: '상세업무1', // 실제 업무 내용
      category: '', // 기존 category 필드 (사용하지 않음)
      subcategory: '', // 기존 subcategory 필드 (사용하지 않음)
      detail: '상세업무1', // 상세 설명
      department: '미정',
      assignee: '미정',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: 7,
      progress: 0,
      status: '미완료' as const,
      cost: '',
      notes: '',
      major_category: trimmedCategory, // 입력받은 대분류명
      middle_category: '중분류1', // 기본 중분류
      minor_category: '소분류1' // 기본 소분류
    }

    const { data: createdTask, error: createError } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single()

    if (createError) {
      console.error('❌ 대분류 Task 생성 오류:', createError)
      return NextResponse.json({
        success: false,
        error: `대분류 Task 생성 실패: ${createError.message}`
      }, { status: 500 })
    }

    console.log(`✅ 새 대분류 Task 추가 성공:`, {
      taskId: newTaskId,
      majorCategory: trimmedCategory,
      middleCategory: '중분류1',
      minorCategory: '소분류1',
      title: '상세업무1'
    })

    return NextResponse.json({
      success: true,
      data: {
        task: createdTask,
        majorCategory: trimmedCategory,
        middleCategory: '중분류1',
        minorCategory: '소분류1'
      },
      message: `대분류 "${trimmedCategory}"에 속하는 기본 Task가 성공적으로 추가되었습니다.`
    })

  } catch (error) {
    console.error('대분류 추가 API 오류:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      message: '대분류 추가에 실패했습니다.'
    }, { status: 500 })
  }
}

/**
 * 대분류 일괄 수정 API
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { oldCategory, newCategory } = body

    console.log(`🚀 API 요청 수신: PATCH /api/major-category`)
    console.log(`📋 요청 데이터:`, { oldCategory, newCategory })

    if (!oldCategory || !newCategory) {
      console.error('❌ 필수 파라미터 누락:', { oldCategory, newCategory })
      return NextResponse.json({
        success: false,
        error: '기존 대분류와 새 대분류가 모두 필요합니다.'
      }, { status: 400 })
    }

    if (oldCategory === newCategory) {
      console.error('❌ 동일한 대분류:', { oldCategory, newCategory })
      return NextResponse.json({
        success: false,
        error: '기존 대분류와 새 대분류가 동일합니다.'
      }, { status: 400 })
    }

    console.log(`🔄 대분류 수정 시작: "${oldCategory}" → "${newCategory}"`)

    // 해당 대분류를 가진 모든 작업 찾기
    const { data: tasksToUpdate, error: findError } = await supabase
      .from('tasks')
      .select('*')
      .eq('major_category', oldCategory)

    if (findError) {
      console.error('❌ 작업 조회 오류:', findError)
      return NextResponse.json({
        success: false,
        error: `작업 조회 실패: ${findError.message}`
      }, { status: 500 })
    }

    if (!tasksToUpdate || tasksToUpdate.length === 0) {
      console.warn(`⚠️ 해당 대분류에 속한 작업 없음: "${oldCategory}"`)
      return NextResponse.json({
        success: false,
        error: '해당 대분류에 속한 작업을 찾을 수 없습니다.'
      }, { status: 404 })
    }

    console.log(`📊 수정할 작업 수: ${tasksToUpdate.length}개`)

    // 모든 작업의 대분류를 새로운 값으로 업데이트
    const { data: updatedTasks, error: updateError } = await supabase
      .from('tasks')
      .update({ major_category: newCategory })
      .eq('major_category', oldCategory)
      .select()

    if (updateError) {
      console.error('❌ 대분류 업데이트 오류:', updateError)
      return NextResponse.json({
        success: false,
        error: `대분류 업데이트 실패: ${updateError.message}`
      }, { status: 500 })
    }

    console.log(`✅ 성공적으로 업데이트된 작업 수: ${updatedTasks?.length || 0}개`)
    console.log(`📋 업데이트된 작업 ID들:`, updatedTasks?.map(t => t.id))

    return NextResponse.json({
      success: true,
      data: {
        oldCategory,
        newCategory,
        updatedCount: updatedTasks?.length || 0,
        updatedTasks
      },
      message: `${updatedTasks?.length || 0}개 작업의 대분류가 성공적으로 수정되었습니다.`
    })

  } catch (error) {
    console.error('대분류 수정 API 오류:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      message: '대분류 수정에 실패했습니다.'
    }, { status: 500 })
  }
}

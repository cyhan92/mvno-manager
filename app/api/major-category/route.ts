import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

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

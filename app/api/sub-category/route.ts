import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, middleCategory, subCategory, currentMiddleCategory, currentSubCategory } = body

    console.log('🚀 API 요청 수신: PATCH /api/sub-category')
    console.log('📋 요청 데이터:', { taskId, middleCategory, subCategory, currentMiddleCategory, currentSubCategory })

    if (!middleCategory) {
      console.error('❌ 필수 파라미터 누락:', { middleCategory })
      return NextResponse.json(
        { error: '중분류가 필요합니다.' },
        { status: 400 }
      )
    }

    // 중분류만 수정하는 경우 (currentMiddleCategory만 있고 currentSubCategory는 없거나 undefined)
    if (currentMiddleCategory && !currentSubCategory) {
      console.log('🔍 중분류만 일괄 업데이트:', {
        from: { middle: currentMiddleCategory },
        to: { middle: middleCategory }
      })

      // 동일한 중분류를 가진 모든 작업의 중분류만 업데이트 (소분류는 그대로 유지)
      const { data: updatedTasks, error: updateError } = await supabase
        .from('tasks')
        .update({
          middle_category: middleCategory
        })
        .eq('middle_category', currentMiddleCategory)
        .select()

      if (updateError) {
        console.error('❌ 중분류 업데이트 오류:', updateError)
        return NextResponse.json(
          { error: `중분류 업데이트 실패: ${updateError.message}` },
          { status: 500 }
        )
      }

      console.log('✅ 중분류 업데이트 성공:', {
        updatedCount: updatedTasks?.length || 0,
        updatedTasks: updatedTasks?.map(t => ({ id: t.id, task_id: t.task_id, title: t.title }))
      })

      return NextResponse.json({
        success: true,
        message: `${updatedTasks?.length || 0}개 작업의 중분류가 업데이트되었습니다.`,
        updatedTasks
      })
    }

    // 현재 중분류/소분류 정보가 있는 경우 이를 이용해 일괄 업데이트
    if (currentMiddleCategory && currentSubCategory) {
      console.log('🔍 기존 중분류/소분류로 일괄 업데이트:', {
        from: { middle: currentMiddleCategory, minor: currentSubCategory },
        to: { middle: middleCategory, minor: subCategory }
      })

      // 동일한 중분류/소분류를 가진 모든 작업을 업데이트
      const updateData: any = {
        middle_category: middleCategory
      }
      
      // 소분류가 제공된 경우에만 업데이트
      if (subCategory) {
        updateData.minor_category = subCategory
      }

      const { data: updatedTasks, error: updateError } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('middle_category', currentMiddleCategory)
        .eq('minor_category', currentSubCategory)
        .select()

      if (updateError) {
        console.error('❌ 업데이트 오류:', updateError)
        return NextResponse.json(
          { error: `업데이트 실패: ${updateError.message}` },
          { status: 500 }
        )
      }

      console.log('✅ 업데이트 성공:', {
        updatedCount: updatedTasks?.length || 0,
        updatedTasks: updatedTasks?.map(t => ({ id: t.id, task_id: t.task_id, title: t.title }))
      })

      return NextResponse.json({
        success: true,
        message: `${updatedTasks?.length || 0}개 작업의 중분류/소분류가 업데이트되었습니다.`,
        updatedTasks
      })
    }

    // 현재 정보가 없는 경우 에러 반환
    console.error('❌ 현재 중분류/소분류 정보가 필요합니다.')
    return NextResponse.json(
      { error: '현재 중분류와 소분류 정보가 필요합니다.' },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

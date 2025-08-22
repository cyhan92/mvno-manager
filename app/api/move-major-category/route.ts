import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Service Role Key가 있으면 우선 사용, 없으면 Anon Key 사용
const effectiveKey = supabaseServiceKey || supabaseAnonKey

/**
 * 소분류의 대분류 이동 API
 * 선택된 소분류의 모든 하위 Task들의 대분류를 변경합니다.
 */
export async function PUT(request: Request) {
  try {
    const { currentMajorCategory, currentMinorCategory, targetMajorCategory } = await request.json()
    
    if (!currentMajorCategory || !currentMinorCategory || !targetMajorCategory) {
      return NextResponse.json({
        success: false,
        error: '필수 매개변수가 누락되었습니다: currentMajorCategory, currentMinorCategory, targetMajorCategory'
      }, { status: 400 })
    }

    if (!supabaseUrl || !effectiveKey) {
      return NextResponse.json({
        success: false,
        error: 'Supabase 환경변수가 설정되지 않았습니다.'
      }, { status: 500 })
    }

    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      usingServiceRole: !!supabaseServiceKey
    })

    const supabase = createClient(supabaseUrl, effectiveKey)

    // 1. 현재 소분류에 속한 모든 Task 조회
    const { data: tasksToUpdate, error: selectError } = await supabase
      .from('tasks')
      .select('*')
      .eq('major_category', currentMajorCategory)
      .eq('minor_category', currentMinorCategory)

    if (selectError) {
      console.error('Tasks 조회 오류:', selectError)
      return NextResponse.json({
        success: false,
        error: `Tasks 조회 실패: ${selectError.message}`
      }, { status: 500 })
    }

    if (!tasksToUpdate || tasksToUpdate.length === 0) {
      return NextResponse.json({
        success: false,
        error: '해당 조건에 맞는 Task가 없습니다.'
      }, { status: 404 })
    }

    // 2. 모든 해당 Task들의 대분류 업데이트
    const { data: updatedTasks, error: updateError } = await supabase
      .from('tasks')
      .update({ 
        major_category: targetMajorCategory,
        updated_at: new Date().toISOString()
      })
      .eq('major_category', currentMajorCategory)
      .eq('minor_category', currentMinorCategory)
      .select()

    if (updateError) {
      console.error('Tasks 업데이트 오류:', updateError)
      return NextResponse.json({
        success: false,
        error: `Tasks 업데이트 실패: ${updateError.message}`
      }, { status: 500 })
    }

    console.log(`✅ 대분류 이동 완료: ${tasksToUpdate.length}개 Task 업데이트`)
    console.log(`   - 이전: ${currentMajorCategory} > ${currentMinorCategory}`)
    console.log(`   - 이후: ${targetMajorCategory} > ${currentMinorCategory}`)

    return NextResponse.json({
      success: true,
      message: `${tasksToUpdate.length}개의 Task가 성공적으로 이동되었습니다.`,
      data: {
        updatedCount: tasksToUpdate.length,
        updatedTasks: updatedTasks,
        fromMajorCategory: currentMajorCategory,
        toMajorCategory: targetMajorCategory,
        minorCategory: currentMinorCategory
      }
    })
    
  } catch (error) {
    console.error('대분류 이동 오류:', error)
    
    return NextResponse.json({
      success: false,
      error: '대분류 이동 중 오류가 발생했습니다.'
    }, { status: 500 })
  }
}

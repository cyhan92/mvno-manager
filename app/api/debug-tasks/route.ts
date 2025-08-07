import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 테이블 구조 및 데이터 확인 중...')

    // 모든 태스크 조회
    const { data: allTasks, error: allError } = await supabase
      .from('tasks')
      .select('*')
      .limit(5)

    console.log('📋 전체 태스크 데이터 (첫 5개):', allTasks)
    console.log('❌ 오류:', allError)

    // 특정 task_id로 조회 테스트
    const { data: specificTask, error: specificError } = await supabase
      .from('tasks')
      .select('*')
      .eq('task_id', 'TASK-001')
      .single()

    console.log('🎯 TASK-001 조회 결과:', specificTask)
    console.log('❌ TASK-001 오류:', specificError)

    return NextResponse.json({
      message: '데이터 확인 완료',
      allTasks,
      allError,
      specificTask,
      specificError
    })

  } catch (error) {
    console.error('🚨 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.', details: error },
      { status: 500 }
    )
  }
}

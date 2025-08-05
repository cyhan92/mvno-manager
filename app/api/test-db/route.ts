import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Supabase 연결 테스트 시작...')
    
    // 1. 기본 연결 테스트
    const { data: connectionTest, error: connectionError } = await supabase
      .from('tasks')
      .select('count', { count: 'exact', head: true })
    
    if (connectionError) {
      console.error('❌ Supabase 연결 실패:', connectionError)
      return NextResponse.json({
        success: false,
        error: 'Supabase 연결 실패',
        details: connectionError.message,
        code: connectionError.code,
        hint: connectionError.hint
      }, { status: 500 })
    }
    
    console.log('✅ Supabase 연결 성공')
    
    // 2. 테이블 구조 확인 (빈 INSERT로 컬럼 구조 확인)
    const { data: tableInfo, error: tableError } = await supabase
      .from('tasks')
      .select('*')
      .limit(0)
    
    if (tableError) {
      console.error('❌ 테이블 접근 실패:', tableError)
      return NextResponse.json({
        success: false,
        error: '테이블 접근 실패',
        details: tableError.message,
        code: tableError.code,
        hint: tableError.hint || '테이블이 생성되지 않았을 수 있습니다. supabase/migrations/001_create_tasks_table.sql을 실행해주세요.'
      }, { status: 500 })
    }
    
    // 3. 실제 INSERT 테스트 (가짜 데이터로)
    const testData = {
      task_id: 'TEST-001',
      title: 'Test Task',
      category: 'Test Category',
      progress: 0,
      status: '미완료' as const
    }
    
    const { data: insertTest, error: insertError } = await supabase
      .from('tasks')
      .insert(testData)
      .select()
    
    // 테스트 데이터 삭제
    if (insertTest && insertTest.length > 0) {
      await supabase
        .from('tasks')
        .delete()
        .eq('task_id', 'TEST-001')
    }
    
    if (insertError) {
      console.error('❌ INSERT 테스트 실패:', insertError)
      return NextResponse.json({
        success: false,
        error: 'INSERT 테스트 실패',
        details: insertError.message,
        code: insertError.code,
        hint: insertError.hint
      }, { status: 500 })
    }
    
    console.log('✅ 테이블 접근 및 INSERT 테스트 성공')
    
    return NextResponse.json({
      success: true,
      message: 'Supabase 연결 및 테이블 접근 성공',
      data: {
        taskCount: connectionTest || 0,
        tableExists: true,
        insertTestSuccess: true
      }
    })
    
  } catch (error) {
    console.error('❌ 예상치 못한 오류:', error)
    return NextResponse.json({
      success: false,
      error: '예상치 못한 오류',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
